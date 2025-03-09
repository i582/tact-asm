import {ADD, PUSH, PUSHINT_8, STZEROES, SUB} from "./instr.gen"
import {compileCell, Instr} from "./instr"
import {AssemblyWriter, disassembleRoot} from "opcode"

// type Tree = Blue | Hole
//
// type Blue = {
//     $: "Blue"
//     name: string
//     left: Tree
//     right: Tree
// }
//
// type Hole = {
//     $: "Hole"
//     val: number
// }
//
// type Instr = BlueInstr | RedInstr
//
// type BlueInstr = {
//     $: "BlueInstr"
//     name: string
// }
//
// type RedInstr = {
//     $: "RedInstr"
//     name: string
// }
//
// type LinearizeResult = {
//     instructions: Instr[]
// }
//
// declare const linearize: (tree: Tree) => LinearizeResult[]
// declare const countOrders: (tree: Tree) => number

type AstNode = BinCall | Literal | Variable

type Func = {
    args: string[]
    expr: AstNode
}

type Literal = {
    $: "Literal"
    val: number
}

const Literal = (val: number): Literal => ({
    $: "Literal",
    val,
})

type Variable = {
    $: "Variable"
    name: string
}

const Variable = (name: string): Variable => ({
    $: "Variable",
    name,
})

type BinCall = {
    $: "Call"
    name: "+" | "-"
    left: AstNode
    right: AstNode
}

const BinCall = (name: "+" | "-", left: AstNode, right: AstNode): BinCall => ({
    $: "Call",
    name,
    left,
    right,
})

type Compile<T> = (stack: string[], node: T) => CompileResult

type CompileResult = {
    instructions: Instr[]
    newStack: string[]
}

const compileFunc: Compile<AstNode> = (stack, expr) => {
    return compileAny(stack, expr)
}

const compileAny: Compile<AstNode> = (stack, node) => {
    switch (node.$) {
        case "Call":
            return compileCall(stack, node)
        case "Literal":
            return compileLiteral(stack, node)
        case "Variable":
            return compileVariable(stack, node)
    }
}

const compileCall: Compile<BinCall> = (stack, call) => {
    const op = call.name === "+" ? ADD() : SUB()
    const leftInstr = compileAny(stack, call.left)
    const rightResult = compileAny(leftInstr.newStack, call.right)
    const finalStack = rightResult.newStack.slice(0, rightResult.newStack.length - 2)

    return {
        newStack: [...finalStack, call.name],
        instructions: [...leftInstr.instructions, ...rightResult.instructions, op],
    }
}

const compileVariable: Compile<Variable> = (stack, variable) => {
    const index = stack.findLastIndex(it => it === variable.name)
    if (index === undefined) {
        throw new Error("unknown error")
    }

    return {
        newStack: [...stack, stack[index]],
        instructions: [PUSH(stack.length - 1 - index)],
    }
}

const compileLiteral: Compile<Literal> = (stack, lit) => {
    return {
        newStack: [...stack, lit.val.toString()],
        instructions: [PUSHINT_8(lit.val)],
    }
}

// const rules = [["ZERO SWAP STU($X)", "PUSHINT($X) STZEROES"]]
//
// const optimize = ([zero, swap, stu, ...rest]: Instr[]): undefined | Instr[] => {
//     if (zero.kind === "ZERO" && swap.kind === "SWAP" && stu.kind === "STU") {
//         return [PUSHINT_8(stu.arg), STZEROES(), ...rest]
//     }
//
//     return undefined
// }

const result = compileFunc(
    ["a", "b", "c"],
    BinCall("+", Variable("a"), BinCall("+", Variable("b"), Variable("a"))),
)

const cell = compileCell(result.instructions)

const disasn = disassembleRoot(cell, {computeRefs: false})
console.log(AssemblyWriter.write(disasn, {}))

// linearize(Hole(0)) = [[]]
// linearize(Blue(name, Hole(0), Hole(1))) = [[RedInstr("swap"), BlueInstr(name)]]
// linearize(Blue(name, Hole(1), Hole(0))) = [[BlueInstr(name)]]
//
//
//
// linearize(Blue(name,
//     Blue(name, Hole(3), Hole(2))),
//     Blue(name, Hole(1), Hole(0)))
// )) = [
//     [
//         BlueInstr("sub"),     // linearize(Blue("sub", Hole(1), Hole(0))) = [[BlueInstr("sub")]]
//         RedInstr("rotrev"),
//         BlueInstr("sub"),     // linearize(Blue("sub", Hole(1), Hole(0))) = [[BlueInstr("sub")]]
//         RedInstr("swap"),
//         BlueInstr("sub"),
//     ],
//     [
//         RedInstr("swap2"),
//         BlueInstr("sub"),
//         RedInstr("rotrev"),
//         BlueInstr("sub"),
//         BlueInstr("sub"),
//     ],
// ]
