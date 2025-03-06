import {Instr} from "./instr"
import {Builder} from "@ton/core"

export const call = (what: Instr, args: Instr[]): Instr => {
    return {
        store: (b: Builder) => {
            args.forEach(arg => arg.store(b))
            what.store(b)
        },
    }
}
