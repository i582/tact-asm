import {Instr} from "./instr"
import {Builder} from "@ton/core"
import {PUSHCONT} from "./complex-instructions"
import {EXECUTE} from "./instr.gen"

export const call = (what: Instr, args: Instr[]): Instr => {
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

export const debug = (instr: Instr) => {
    return {
        store: (b: Builder) => {
            debugger
            instr.store(b)
        },
    }
}
