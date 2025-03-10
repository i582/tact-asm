import {compileCell, Instr} from "./instr"
import {Builder} from "@ton/core"
import {EPS, PUSHCONT, PUSHSLICE} from "./complex-instructions"
import {EXECUTE, IF, NOP, PUSHINT} from "./instr.gen"
import * as i from "./index"

export const call = (what: Instr, ...args: Instr[]): Instr => {
    return {
        store: (b: Builder) => {
            args.forEach(arg => arg.store(b))
            what.store(b)
        },
    }
}

export type Func = () => Instr[]

export const execute = (f: Func, ...args: Instr[]): Instr => {
    return {
        store: (b: Builder) => {
            args.forEach(arg => arg.store(b))
            PUSHCONT(f()).store(b)
            EXECUTE().store(b)
        },
    }
}

export const when = (cond: Instr[], then: Instr[]): Instr => {
    return {
        store: (b: Builder) => {
            cond.forEach(arg => arg.store(b))
            PUSHCONT(then).store(b)
            IF().store(b)
        },
    }
}

export const sliceConst = (instructions: Instr[]) => {
    return compileCell(instructions).asSlice()
}

export const debug = (instr: Instr) => {
    return {
        store: (b: Builder) => {
            debugger
            instr.store(b)
        },
    }
}

export const top = EPS()

export const runVM = (): i.Instr[] => [
    i.DUP(),
    i.PUSHCTR(7),
    i.SWAP(),
    i.TPUSH(),
    i.POPCTR(7),

    i.PUSHINT(0),
    i.ROTREV(),
    i.PUSHINT_LONG(1000000n),

    i.RUNVM(392),
    i.PUSHINT(5),
    i.SUB(),
    // i.DUMPSTK(),

    i.PUSHCTR(7),
    i.SWAP(),
    i.TPUSH(),
    i.SWAP(),
    i.TPUSH(),
    i.PUSHCTR(7),
    i.LAST(),
    i.SWAP(),
    i.POPCTR(7),
    i.DROPX(),
    i.PUSHCTR(7),
    i.TPOP(),
    i.SWAP(),
    i.TPOP(),
    i.SWAP(),
    i.POPCTR(7),
]

export const measureGas2 = (instructions: Instr[]): Instr => {
    return {
        store: (b: Builder) => {
            execute(runVM, PUSHSLICE(sliceConst(instructions)), PUSHINT(1)).store(b)
        },
    }
}
