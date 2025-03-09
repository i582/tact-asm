import {instructions, noArgs, Opcode} from "./asm1"
import * as fs from "node:fs"

const lines: string[] = []

const simpleInstructions = Object.entries(instructions).filter(entry => entry[1].kind === "simple")

const fixedInstructions = Object.entries(instructions)
    .filter(entry => entry[1].kind === "fixed")
    .sort((a, b) => a[1].args.tsTypes().length - b[1].args.tsTypes().length)

const fixedRangeInstructions = Object.entries(instructions).filter(
    entry => entry[1].kind === "fixed-range",
)

const otherInstructions = Object.entries(instructions).filter(entry => entry[1].kind === "other")

let generatedCount = 0

function processInstr(entry: [string, Opcode<unknown>]) {
    const name = entry[0]
    const descr = entry[1]
    const realName = name.startsWith("2") ? name.slice(1) + "2" : name
    const realRealName = realName.replace("#", "_")

    if (realRealName === "XCHG_0" || realRealName === "THROW_SHORT") {
        // generated in complex-instructions.ts
        return
    }

    let result = `export const ${realRealName} = `

    const argTypes = descr.args.tsTypes()
    const hexPrefix = descr.prefix.toString(16)

    if (descr.kind === "fixed-range") {
        if (argTypes.length === 1) {
            result += `createFixedRangeInstr(0x${hexPrefix}, ${descr.checkLen}, ${descr.skipLen - descr.checkLen}, ${argTypes[0]})`
        } else {
            const argsString = descr.argsString
            if (argsString.startsWith("seq2")) {
                // seq2(uint(4), uint(5))
                //      ^^^^^^^^^^^^^^^^
                const args = argsString
                    .slice(5, -1)
                    .split(",")
                    .map(it => it.trim())
                result += `createBinaryFixedRangeInstr(0x${hexPrefix}, ${descr.checkLen}, ${descr.skipLen - descr.checkLen}, ${args[0]}, ${args[1]})`
            } else {
                result += `createFixedRangeInstr(0x${hexPrefix}, ${descr.checkLen}, ${descr.skipLen - descr.checkLen}, ${argsString})`
            }
        }
    }

    if (descr.kind === "simple") {
        if (descr.args === noArgs) {
            result += `() => createSimpleInstr(0x${hexPrefix}, ${descr.checkLen});`
        } else {
            if (argTypes.length === 1) {
                result += `createUnaryInstr(0x${hexPrefix}, ${descr.checkLen}, ${argTypes[0]})`
            }
            if (argTypes.length === 2) {
                result += `createBinaryInstr(0x${hexPrefix}, ${descr.checkLen}, ${argTypes[0]}, ${argTypes[1]})`
            }
            if (argTypes.length === 3) {
                result += `createTernaryInstr(0x${hexPrefix}, ${descr.checkLen}, ${argTypes[0]}, ${argTypes[1]}, ${argTypes[2]})`
            }
        }
    }

    if (descr.kind === "fixed") {
        if (argTypes.length === 1) {
            result += `createUnaryInstr(0x${hexPrefix}, ${descr.checkLen}, ${argTypes[0]})`
        }
        if (argTypes.length === 2) {
            result += `createBinaryInstr(0x${hexPrefix}, ${descr.checkLen}, ${argTypes[0]}, ${argTypes[1]})`
        }
        if (argTypes.length === 3) {
            result += `createTernaryInstr(0x${hexPrefix}, ${descr.checkLen}, ${argTypes[0]}, ${argTypes[1]}, ${argTypes[2]})`
        }
    }

    if (descr.kind === "other") {
        const name = entry[0]

        if (name.includes("PUSHSLICE_REFS")) {
            // handled in PUSHSLICE
            return
        }

        if (name.includes("PUSHSLICE_LONG_")) {
            // handled in PUSHSLICE_LONG
            return
        }

        if (name.includes("STSLICECONST_")) {
            // handled in STSLICECONST
            return
        }

        if (name.startsWith("PUSHCONT_") && ["1", "2", "3"].includes(name.at(-1) ?? "")) {
            // handled in PUSHCONT
            return
        }

        result = `const _${name} = C.${name}`
    }

    lines.push(result)
    generatedCount++
}

lines.push(`//#region Simple instructions, ${simpleInstructions.length}`)
simpleInstructions.map(entry => {
    // @ts-ignore
    processInstr(entry)
})
lines.push(`//#endregion`)

lines.push(``)
lines.push(`//#region Fixed instructions, ${fixedInstructions.length}`)
fixedInstructions.map(entry => {
    // @ts-ignore
    processInstr(entry)
})
lines.push(`//#endregion`)

lines.push(``)
lines.push(`//#region Fixed range instructions, ${fixedRangeInstructions.length}`)
fixedRangeInstructions.map(entry => {
    // @ts-ignore
    processInstr(entry)
})
lines.push(`//#endregion`)

lines.push(``)
lines.push(`//#region Other instructions, ${fixedRangeInstructions.length}`)
otherInstructions.map(entry => {
    // @ts-ignore
    processInstr(entry)
})
lines.push(`//#endregion`)
lines.push(``)
lines.push(`// Generated ${generatedCount} instructions`)

const header = `import {
    createSimpleInstr,
    createUnaryInstr,
    createBinaryInstr,
    createTernaryInstr,
    createFixedRangeInstr,
    createBinaryFixedRangeInstr,
} from "./instr"
import * as C from "./complex-instructions"
import {
    uint,
    int,
    hash,
    tinyInt,
    plduzArg,
    xchgArgs,
    minusOne,
    delta,
    stack,
    control,
    s1,
} from "./asm1"

`

fs.writeFileSync("instr.gen.ts", header + lines.join("\n") + "\n")
