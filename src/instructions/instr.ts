import {Builder, Cell, BitBuilder, Slice} from "@ton/core"
import {Ty} from "./asm"

export type Instr = {
    store: (b: Builder) => void
    print?: () => string[]
}

export const createSimpleInstr = (prefix: number, prefixLength: number): Instr => {
    return {
        store: (b: Builder) => {
            b.storeUint(prefix, prefixLength)
        },
    }
}

export const createUnaryInstr = <T>(
    prefix: number,
    prefixLength: number,
    serializer: Ty<T>,
): ((arg: T) => Instr) => {
    return arg => {
        return {
            store: (b: Builder) => {
                b.storeUint(prefix, prefixLength)
                serializer.store(arg, b)
            },
        }
    }
}

export const createFixedRangeInstr = <T>(
    prefix: number,
    prefixLength: number,
    shiftLength: number,
    serializer: Ty<T>,
): ((arg: T) => Instr) => {
    return arg => {
        return {
            store: (b: Builder) => {
                b.storeUint(prefix >> shiftLength, prefixLength)
                serializer.store(arg, b)
            },
        }
    }
}

export const createBinaryFixedRangeInstr = <T>(
    prefix: number,
    prefixLength: number,
    shiftLength: number,
    serializer1: Ty<T>,
    serializer2: Ty<T>,
): ((arg1: T, arg2: T) => Instr) => {
    return (arg1, arg2) => {
        return {
            store: (b: Builder) => {
                b.storeUint(prefix >> shiftLength, prefixLength)
                serializer1.store(arg1, b)
                serializer2.store(arg2, b)
            },
        }
    }
}

export const createBinaryInstr = <T1, T2>(
    prefix: number,
    prefixLength: number,
    serializer1: Ty<T1>,
    serializer2: Ty<T2>,
): ((arg: T1, arg2: T2) => Instr) => {
    return (arg, arg2) => {
        return {
            store: (b: Builder) => {
                b.storeUint(prefix, prefixLength)
                serializer1.store(arg, b)
                serializer2.store(arg2, b)
            },
        }
    }
}

export const createTernaryInstr = <T1, T2, T3>(
    prefix: number,
    prefixLength: number,
    serializer1: Ty<T1>,
    serializer2: Ty<T2>,
    serializer3: Ty<T3>,
): ((arg1: T1, arg2: T2, arg3: T3) => Instr) => {
    return (arg1, arg2, arg3) => {
        return {
            store: (b: Builder) => {
                b.storeUint(prefix, prefixLength)
                serializer1.store(arg1, b)
                serializer2.store(arg2, b)
                serializer3.store(arg3, b)
            },
        }
    }
}

export const createRefInstr = (
    prefix: number,
    prefixLength: number,
): ((instructions: Instr[]) => Instr) => {
    return instructions => {
        return {
            store: (b: Builder) => {
                b.storeUint(prefix, prefixLength)
                b.storeRef(compileCell(instructions))
            },
        }
    }
}

export const compile = (instructions: Instr[]): Buffer => {
    const b = new Builder()
    instructions.forEach(instruction => instruction.store(b))
    return b.endCell().toBoc()
}

export const compileCell = (instructions: Instr[]): Cell => {
    const b = new Builder()
    instructions.forEach(instruction => {
        instruction.store(b)
    })
    return b.endCell()
}

export const hex = (value: string): Slice => {
    const b = new Builder()

    let res2 = ""
    for (let i = 0; i < value.length; i++) {
        const ch = value[i]
        if (ch === "_") break
        res2 += Number.parseInt(ch, 16).toString(2).padStart(4, "0")
    }

    if (value.endsWith("_")) {
        res2 = res2.replace(/10*$/, "")
    }

    for (let i = 0; i < res2.length; i++) {
        const ch = res2[i]
        b.storeBit(ch === "1")
    }

    return b.asSlice()
}
