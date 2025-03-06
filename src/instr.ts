import {beginCell, Builder, Cell, Dictionary, DictionaryKey, DictionaryValue} from "@ton/core";
import {delta, seq1, seq2, Ty, uint, xchgArgs} from "./asm1";

export type Instr = {
    store: (b: Builder) => void
}

export type UnaryInstr<T> = {
    arg: T,
    store: (b: Builder) => void
}

export const createSimpleInstr = (prefix: number, prefixLength: number): Instr => {
    return {
        store: (b: Builder) => {
            b.storeUint(prefix, prefixLength)
        }
    }
}

export const createUnaryInstr = <T>(prefix: number, prefixLength: number, serializer: Ty<T>): (arg: T) => Instr => {
    return (arg: T) => {
        return {
            store: (b: Builder) => {
                b.storeUint(prefix, prefixLength)
                serializer.store(arg, b)
            }
        }
    }
}

export const createFixedRangeInstr = <T>(prefix: number, prefixLength: number, shiftLength: number, serializer: Ty<T>): (arg: T) => Instr => {
    return (arg: T) => {
        return {
            store: (b: Builder) => {
                b.storeUint(prefix >> shiftLength, prefixLength)
                serializer.store(arg, b)
            }
        }
    }
}

export const SETCP_1 = createFixedRangeInstr(0xfff1, 8, 8, seq1(delta(-256, uint(8))));
export const PUSHPOW2 = createFixedRangeInstr(0x8300, 8, 8, seq1(delta(1, uint(8))));
export const BLKPUSH = createFixedRangeInstr(0x5f10, 8, 8, seq2(uint(4), uint(4)));
export const BLKDROP2 = createFixedRangeInstr(0x6c10, 8, 8, seq2(uint(4), uint(4)));
export const GETGLOB = createFixedRangeInstr(0xf841, 11, 5, seq1(uint(5)));
export const SETGLOB = createFixedRangeInstr(0xf861, 11, 5, seq1(uint(5)));

// export const PUSHPOW2 = createFixedRangeInstr(0x8300, 8, 8, delta(1, uint(8)))

export const createBinaryInstr = <T1, T2>(prefix: number, prefixLength: number, serializer1: Ty<T1>, serializer2: Ty<T2>): (arg: T1, arg2: T2) => Instr => {
    return (arg: T1, arg2: T2) => {
        return {
            store: (b: Builder) => {
                b.storeUint(prefix, prefixLength)
                serializer1.store(arg, b)
                serializer2.store(arg2, b)
            }
        }
    }
}

export const createTernaryInstr = <T1, T2, T3>(prefix: number, prefixLength: number, serializer1: Ty<T1>, serializer2: Ty<T2>, serializer3: Ty<T3>): (arg: T1, arg2: T2, arg3: T3) => Instr => {
    return (arg, arg2, arg3) => {
        return {
            store: (b: Builder) => {
                b.storeUint(prefix, prefixLength)
                serializer1.store(arg, b)
                serializer2.store(arg2, b)
                serializer3.store(arg3, b)
            }
        }
    }
}
function createCodeCell(): DictionaryValue<Cell> {
    return {
        serialize: (src, builder) => {
            builder.storeBits(src.bits)
            for (const ref of src.refs) {
                builder.storeRef(ref)
            }
        },
        parse: (src): Cell => {
            const cloned = src.clone(true)
            return cloned.asCell()
        },
    }
}

export type PUSHDICTCONST = Instr;

export const PUSHDICTCONST = (mapping: Map<number, Instr[]>): PUSHDICTCONST => {
    return {
        store: (b: Builder) => {
            let offset = 0
            const dict = Dictionary.empty<number, Cell>(
                Dictionary.Keys.Int(19),
                createCodeCell(),
            )
            mapping.entries().forEach((entry) => {
                const [id, instructions] = entry
                const cell = compileCell(instructions)

                dict.set(id, cell)

                // cell.refs.forEach((ref) => {
                //     b.storeRef(ref)
                // })

                offset += cell.bits.length
            })

            // DICTPUSHCONST
            b.storeUint(0xF4A400 >> 11, 13) // 0b1111010010100110
            b.storeUint(1, 1)

            b.storeRef(beginCell().storeDictDirect(dict).endCell())

            b.storeUint(19, 10)
        }
    }
}

export type SETCP0 = Instr;

export const SETCP0 = (): SETCP0 => {
    return {
        store: (b: Builder) => {
            b.storeUint(0xFF00n, 16)
        }
    }
}

export type EPS = Instr;

export const EPS = (): EPS => {
    return {
        store: (_: Builder) => {
        }
    }
}
export type THROW = UnaryInstr<bigint>;

export const THROW = (arg: bigint): THROW => {
    return {
        arg: arg,
        store: (b: Builder) => {
            // 0xf2c0 >> 3, 13, 11
            // console.log((0xf20 | (Number(arg) >> 4)).toString(16))
            b.storeUint(0xf20 | (Number(arg) >> 4), 12) // 0b111100100010
            b.storeUint(Number(arg) & 15, 4) // 0b111100100010
            // b.storeUint(0xf20 >> 2, 10) // 0b111100100010
            // b.storeUint(arg, 6)
        }
    }
}

export type PUSHINT4 = UnaryInstr<number>;

export const PUSHINT4 = (arg: number): PUSHINT4 => {
    return {
        arg: arg,
        store: (b: Builder) => {
            b.storeUint(BigInt(7), 4);
            b.storeUint(arg, 4);
        }
    }
}

export type ADD = Instr;

export const ADD = (): ADD => createSimpleInstr(0xA0, 8)

export type DUMPSTK = Instr;

export const DUMPSTK = (): DUMPSTK => createSimpleInstr(0xfe00, 16)

export type DICTIGETJMPZ = Instr;

export const DICTIGETJMPZ = (): DICTIGETJMPZ => {
    return {
        store: (b: Builder) => {
            b.storeUint(0xF4BC, 16)
        }
    }
}

export const ADD_INT = createUnaryInstr(0xa6, 8, uint(8))

export const PLDU = createUnaryInstr(0xd70b, 16, uint(8));
export const LDIQ = createUnaryInstr(0xd70c, 16, uint(8));
export const LDUQ = createUnaryInstr(0xd70d, 16, uint(8));
export const PLDIQ = createUnaryInstr(0xd70e, 16, uint(8));
export const PLDUQ = createUnaryInstr(0xd70f, 16, uint(8));

export const XCHG_1 = createUnaryInstr(0x10, 8, xchgArgs);
export const XCHG3 = createTernaryInstr(0x4, 4, uint(4), uint(4), uint(4));

export const compile = (instructions: Instr[]): Buffer => {
    const b = new Builder();
    instructions.forEach(instruction => instruction.store(b));
    return b.endCell().toBoc()
}

export const compileCell = (instructions: Instr[]): Cell => {
    const b = new Builder();
    instructions.forEach(instruction => {
        instruction.store(b)
    });
    return b.endCell()
}
