import type {
    BlockNode,
    InstructionNode,
    MethodNode,
    ProcedureNode,
    ProgramNode,
    ScalarNode,
} from "../ast/ast"
import {BaseWriter} from "./base-writer"
import {beginCell, BitString, Cell} from "@ton/core"
import {prefixToBin, removeCompletionTag} from "../utils/binutils"
import {Buffer} from "node:buffer"

const OPCODE_RENAMES = new Map([
    ["PUSHINT_4", "PUSHINT"],
    ["LSHIFTDIVMODR_VAR", "LSHIFTDIVMODR"],
    ["MULRSHIFTC_VAR", "MULRSHIFTC"],
    ["MULRSHIFTR_VAR", "MULRSHIFTR"],
    ["MULRSHIFT_VAR", "MULRSHIFT"],
    ["QMULRSHIFT_VAR", "QMULRSHIFT"],
    ["PUSHSLICE_LONG", "PUSHSLICE"],

    ["LSHIFTDIVR", "LSHIFT_DIVR"],
    ["LSHIFTDIVMODR", "LSHIFT_DIVMODR"],
    ["RSHIFTRMOD", "RSHIFTR_MOD"],
    ["QLSHIFTDIVMODR", "QLSHIFT_DIVMODR"],
    ["MULRSHIFTRMOD", "MULRSHIFTR_MOD"],

    ["LSHIFT", "LSHIFT_1"],
    ["RSHIFT", "RSHIFT_1"],
    ["MULRSHIFTR", "MULRSHIFTR_"],
    ["MULRSHIFTC", "MULRSHIFTC_"],
    ["MULMODPOW2", "MULMODPOW2_"],

    ["NULL", "PUSHNULL"],
    ["MULCONST", "MULINT"],
    ["ADDCONST", "ADDINT"],

    ["SAVE", "SAVECTR"],
])

export interface TSAssemblyWriterOptions {}

export class TSAssemblyWriter {
    private readonly writer: BaseWriter = new BaseWriter()

    private readonly options: TSAssemblyWriterOptions

    public constructor(options: TSAssemblyWriterOptions) {
        this.options = options
    }

    protected writeProgramNode(node: ProgramNode): void {
        this.writer.writeLine(`import * as i from "../instructions";`)

        const methods = [...node.methods].sort((a, b) => a.id - b.id)
        const procedures = [...node.procedures].sort((a, b) => a.hash.localeCompare(b.hash))

        this.writer.writeLine("export const instructions = [")

        this.writer.indent(() => {
            node.topLevelInstructions.forEach(it => {
                if (it.opcode.definition.mnemonic === "DICTPUSHCONST") {
                    this.writer.writeLine("i.PUSHDICTCONST(new Map([")
                    this.writer.indent(() => {
                        methods.forEach(method => {
                            this.writeMethodNode(method)
                        })
                        procedures.forEach(procedure => {
                            this.writeNode(procedure)
                        })
                    })
                    this.writer.writeLine("])),")
                    return
                }

                this.writeNode(it)
            })
        })

        this.writer.writeLine("];")
    }

    protected writeMethodNode(node: MethodNode): void {
        this.writer.write(`[${node.id}, `)
        this.writeBlockNode(node.body)
        this.writer.write(`],`)
        this.writer.newLine()
    }

    protected writeProcedureNode(node: ProcedureNode): void {
        this.writer.write(`${node.hash}:`)
        this.writeBlockNode(node.body)
        this.writer.newLine()
    }

    protected writeBlockNode(node: BlockNode): void {
        this.writer.writeLine("[")
        this.writer.indent(() => {
            for (const instruction of node.instructions) {
                this.writeInstructionNode(instruction)
            }
        })
        this.writer.write("]")
    }

    protected maybeSpecificWrite(node: InstructionNode): string | null {
        const opcode = node.opcode.definition.mnemonic

        if (opcode === "HASHEXT_SHA256") {
            return `i.HASHEXT(Hash.SHA256)`
        }

        const firstArg = (node.arguments[0] as ScalarNode | undefined)?.value
        const secondArg = (node.arguments[1] as ScalarNode | undefined)?.value
        if (firstArg === undefined) return null

        if (opcode === "PUSHINT_LONG") {
            return `i.PUSHINT_LONG(${firstArg.toString()}n)`
        }

        if (opcode === "SETCP") {
            return `i.SETCP(${firstArg.toString()})`
        }

        if (opcode === "XCHG_0I") {
            if (firstArg === 1) {
                return `i.SWAP()`
            }

            return `i.XCHG_0(${firstArg.toString()})`
        }

        if (opcode === "XCHG_1I") {
            return `i.XCHG_3(1, ${firstArg.toString()})`
        }

        if (opcode === "XCHG_0I_LONG") {
            return `i.XCHG_LONG(${firstArg.toString()})`
        }

        if (opcode === "POP_LONG") {
            return `i.POP_LONG(${firstArg.toString()})`
        }

        if (opcode === "XCHG_IJ" && secondArg !== undefined) {
            return `i.XCHG_1([${firstArg.toString()}, ${secondArg.toString()}])`
        }

        if (opcode === "CALLXARGS_VAR") {
            return `i.CALLXARGS(${firstArg.toString()}, -1)`
        }

        if (opcode === "PUSHREF" && firstArg.toString().startsWith("x")) {
            return `i.PUSHREF("${firstArg.toString().slice(1)}")`
        }

        if (opcode === "PUSHREFSLICE" && firstArg.toString().startsWith("x")) {
            return `i.PUSHREFSLICE("${firstArg.toString().slice(1)}")`
        }

        // Debug
        if (opcode === "DEBUG") {
            if (firstArg === 0x00) {
                return "DUMPSTK()"
            }
            if (firstArg === 0x14) {
                return "STRDUMP()"
            }

            if (
                secondArg !== undefined &&
                typeof firstArg === "number" &&
                typeof secondArg === "number"
            ) {
                // "fift": "{i*16+j} DEBUG",
                return `i.DEBUG(${firstArg * 16 + secondArg})`
            }
        }

        if (opcode === "DEBUGSTR") {
            const cell = firstArg as string
            const buffer = Buffer.from(cell.slice(2, -1), "hex")
            return `"${buffer.toString()}" DEBUGSTR`
        }

        return null
    }

    protected writeInstructionNode(node: InstructionNode): void {
        const specific = this.maybeSpecificWrite(node)
        if (specific !== null) {
            this.writer.write(specific)
            this.writer.write(",")
            this.writer.writeLine("")
            return
        }

        this.writer.write("i.")
        this.writer.write(
            OPCODE_RENAMES.get(node.opcode.definition.mnemonic) ?? node.opcode.definition.mnemonic,
        )

        this.writer.write("(")

        node.arguments.forEach((arg, index) => {
            switch (arg.type) {
                case "stack_entry": {
                    if (arg.value < 0) {
                        this.writer.write(`${arg.value}`)
                        break
                    }
                    this.writer.write(`${arg.value} `)
                    break
                }
                case "control_register": {
                    if (arg.value < 0) {
                        this.writer.write(`${arg.value}`)
                        break
                    }
                    this.writer.write(`${arg.value} `)
                    break
                }
                case "scalar": {
                    if (arg.value instanceof Cell) {
                        this.writer.write(`CELL`) // TODO
                        break
                    }

                    if (typeof arg.value === "string" && arg.value.startsWith("x")) {
                        const value = arg.value.slice(2, -1)
                        this.writer.write(`i.hex("${value}")`)
                        break
                    }

                    this.writer.write(`${arg.value.toString()} `)
                    break
                }
                case "reference": {
                    throw new Error(`unexpected reference ${arg.hash}`)
                }
                case "global_variable": {
                    throw new Error(`unexpected global ${arg.value}`)
                }
                case "method_reference": {
                    this.writer.write(arg.methodId.toString())
                    break
                }
                case "block": {
                    this.writeBlockNode(arg)
                    this.writer.write(" ")
                    break
                }
            }

            if (index !== node.arguments.length - 1) {
                this.writer.write(", ")
            }
        })

        this.writer.trim()

        this.writer.write("),")

        this.writer.writeLine("")
    }

    protected writeNode(
        node: ProgramNode | MethodNode | ProcedureNode | BlockNode | InstructionNode,
    ): void {
        switch (node.type) {
            case "program": {
                this.writeProgramNode(node)
                break
            }
            case "method": {
                this.writeMethodNode(node)
                break
            }
            case "procedure": {
                this.writeProcedureNode(node)
                break
            }
            case "block": {
                this.writeBlockNode(node)
                break
            }
            case "instruction": {
                this.writeInstructionNode(node)
                break
            }
        }
    }

    protected output(): string {
        return this.writer.end()
    }

    public static write(
        node: ProgramNode | MethodNode | ProcedureNode | BlockNode,
        options: TSAssemblyWriterOptions,
    ): string {
        const writer = new TSAssemblyWriter(options)
        writer.writeNode(node)
        return writer.output()
    }
}
