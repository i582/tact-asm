import {compileCell, createRefInstr, Instr} from "./instr"
import {beginCell, Builder, Cell, Dictionary, DictionaryValue, Slice} from "@ton/core"
import {largeInt, uint} from "./asm1"

export type EPS = Instr

export const EPS = (): EPS => {
    return {
        store: (_: Builder) => {},
        print: () => {
            return []
        },
    }
}

export const THROW_SHORT = (arg: number): Instr => {
    return {
        store: (b: Builder) => {
            b.storeUint(0xf20 | (arg >> 4), 12)
            b.storeUint(arg & 15, 4)
        },
        print: () => [`THROW_SHORT(${arg})`],
    }
}

export const XCHG_0 = (arg: number) => {
    return {
        store: (b: Builder) => {
            b.storeUint(arg & 15, 8)
        },
    }
}

export const PUSHDICTCONST = (keyLength: number, mapping: Map<number, Instr[]>): Instr => {
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

    return {
        store: (b: Builder) => {
            const dict = Dictionary.empty<number, Cell>(
                Dictionary.Keys.Int(keyLength),
                createCodeCell(),
            )
            mapping.entries().forEach(entry => {
                const [id, instructions] = entry
                const cell = compileCell(instructions)
                dict.set(id, cell)
            })

            b.storeUint(0xf4a400 >> 11, 13) // 0b1111010010100110
            b.storeUint(1, 1)

            b.storeRef(beginCell().storeDictDirect(dict).endCell())

            b.storeUint(keyLength, 10)
        },
    }
}

export const DICTPUSHCONST = (slice: Slice, num: number): Instr => {
    return {
        store: (b: Builder) => {
            b.storeUint(0xf4a400 >> 11, 13) // 0b1111010010100110
            b.storeUint(1, 1)

            b.storeRef(slice.asCell())

            b.storeUint(num, 10)
        },
    }
}

export const PUSHCONT = (instructions: Instr[]) => {
    return {
        // 8F_rxxcccc
        //
        // PUSHCONT: cat('cell_const', mkext(0, 0x8e0 >> 3, 9, 7, slice(uint(7), 0), `exec_push_cont`)),
        // PUSHCONT_1: cat('cell_const', mkext(1, 0x8e8 >> 3, 9, 7, slice(uint(7), 0), `exec_push_cont`)),
        // PUSHCONT_2: cat('cell_const', mkext(2, 0x8f0 >> 3, 9, 7, slice(uint(7), 0), `exec_push_cont`)),
        // PUSHCONT_3: cat('cell_const', mkext(3, 0x8f8 >> 3, 9, 7, slice(uint(7), 0), `exec_push_cont`)),
        // PUSHCONT_4: cat('cell_const', mkext(0, 0x9, 4, 4, slice(uint(4), 0), `exec_push_cont_simple`)),

        store: (b: Builder) => {
            const cell = compileCell(instructions)
            const refs = cell.refs.length
            if (refs === 0) {
                b.storeUint(0x8e0 >> 3, 9)
            } else if (refs === 1) {
                b.storeUint(0x8e8 >> 3, 9)
            } else if (refs === 2) {
                b.storeUint(0x8f0 >> 3, 9)
            } else if (refs === 3) {
                b.storeUint(0x8f8 >> 3, 9)
            } else {
                throw new Error("too many refs")
            }

            const slice = cell.asSlice()
            const length = slice.remainingBits

            const y = Math.ceil(length / 8)
            b.storeUint(y, 7)

            b.storeSlice(slice)

            // b.storeUint(0x1, 1)

            // TODO: remove
            const realLength = y * 8
            if (realLength - length > 0) {
                b.storeUint(0x0, realLength - length)
            }

            // for (const ref of cell.refs) {
            //     b.storeRef(ref)
            // }
        },
    }
}

export const PUSHSLICE = (slice: Slice) => {
    const MAX_SLICE_LENGTH = 8 * 31 + 1
    if (slice.remainingBits >= MAX_SLICE_LENGTH) {
        return PUSHSLICE_LONG(slice)
    }

    return {
        // PUSHSLICE: cat('cell_const', mkext(0, 0x8b,        8, 4, slice(uint(4), 4), `exec_push_slice`)),
        // PUSHSLICE_REFS_1: cat('cell_const', mkext(1, 0x8c0 >> 2, 10, 5, slice(uint(5), 1), `exec_push_slice_r`)),
        // PUSHSLICE_REFS_2: cat('cell_const', mkext(2, 0x8c4 >> 2, 10, 5, slice(uint(5), 1), `exec_push_slice_r`)),
        // PUSHSLICE_REFS_3: cat('cell_const', mkext(3, 0x8c8 >> 2, 10, 5, slice(uint(5), 1), `exec_push_slice_r`)),
        // PUSHSLICE_REFS_4: cat('cell_const', mkext(4, 0x8cc >> 2, 10, 5, slice(uint(5), 1), `exec_push_slice_r`)),

        store: (b: Builder) => {
            const refs = slice.remainingRefs

            if (refs === 0) {
                b.storeUint(0x8b, 8)

                const length = slice.remainingBits + 1
                const y = Math.ceil((length - 4) / 8)
                b.storeUint(y, 4)

                b.storeSlice(slice)
                b.storeUint(0x1, 1)

                const realLength = y * 8 + 4
                if (realLength - length > 0) {
                    b.storeUint(0x0, realLength - length)
                }
                return
            }

            const length = slice.remainingBits + 1
            if (refs === 1) {
                b.storeUint(0x8c0 >> 2, 10)
            } else if (refs === 2) {
                b.storeUint(0x8c4 >> 2, 10)
            } else if (refs === 3) {
                b.storeUint(0x8c8 >> 2, 10)
            } else if (refs === 4) {
                b.storeUint(0x8cc >> 2, 10)
            } else {
                throw new Error("too many refs")
            }

            const y = Math.ceil((length - 1) / 8)
            b.storeUint(y, 5)

            b.storeSlice(slice)

            b.storeUint(0x1, 1)

            const realLength = y * 8 + 1
            if (realLength - length > 0) {
                b.storeUint(0x0, realLength - length)
            }
        },
    }
}

export const PUSHSLICE_LONG = (slice: Slice) => {
    return {
        // PUSHSLICE_LONG_0: cat('cell_const', mkext(0, 0x8d0 >> 1, 11, 7, slice(uint(7), 6), `exec_push_slice_r2`)),
        // PUSHSLICE_LONG_1: cat('cell_const', mkext(1, 0x8d2 >> 1, 11, 7, slice(uint(7), 6), `exec_push_slice_r2`)),
        // PUSHSLICE_LONG_2: cat('cell_const', mkext(2, 0x8d4 >> 1, 11, 7, slice(uint(7), 6), `exec_push_slice_r2`)),
        // PUSHSLICE_LONG_3: cat('cell_const', mkext(3, 0x8d6 >> 1, 11, 7, slice(uint(7), 6), `exec_push_slice_r2`)),
        // PUSHSLICE_LONG_4: cat('cell_const', mkext(4, 0x8d8 >> 1, 11, 7, slice(uint(7), 6), `exec_push_slice_r2`)),

        store: (b: Builder) => {
            const refs = slice.remainingRefs

            if (refs === 0) {
                b.storeUint(0x8d0 >> 1, 11)
            } else if (refs === 1) {
                b.storeUint(0x8d2 >> 1, 11)
            } else if (refs === 2) {
                b.storeUint(0x8d4 >> 1, 11)
            } else if (refs === 3) {
                b.storeUint(0x8d6 >> 1, 11)
            } else if (refs === 4) {
                b.storeUint(0x8d8 >> 1, 11)
            } else {
                throw new Error("too many refs")
            }

            const length = slice.remainingBits + 1
            const y = Math.ceil((length - 6) / 8)
            b.storeUint(y, 7)

            b.storeSlice(slice)

            b.storeUint(0x1, 1)

            const realLength = y * 8 + 6
            if (realLength - length > 0) {
                b.storeUint(0x0, realLength - length)
            }
        },
    }
}

export const PUSHCONT_SHORT = (instructions: Instr[]) => {
    return {
        // 9xccc
        //
        // PUSHCONT_4: cat('cell_const', mkext(0, 0x9, 4, 4, slice(uint(4), 0), `exec_push_cont_simple`)),

        store: (b: Builder) => {
            b.storeUint(0x9, 4)

            const cell = compileCell(instructions)

            const length = cell.bits.length
            const x = Math.ceil(length / 8)

            b.storeUint(x, 4) // x

            b.storeSlice(cell.asSlice())
        },
    }
}

// SECTION: Ref instructions
export const PSEUDO_PUSHREF = (instructions: Instr[]) => {
    return {
        name: "PSEUDO_PUSHREF",
        store: (b: Builder) => {
            b.storeRef(compileCell(instructions))
        },
    }
}

export const PUSHREFSLICE_CONST = (slice: Slice) => {
    return {
        store: (b: Builder) => {
            b.storeUint(0x89, 8)
            b.storeRef(slice.asCell())
        },
    }
}

export const PUSHREF = createRefInstr(0x88, 8)
export const PUSHREFSLICE = createRefInstr(0x89, 8)
export const PUSHREFCONT = createRefInstr(0x8a, 8)
export const CALLREF = createRefInstr(0xdb3c, 16)
export const JMPREF = createRefInstr(0xdb3d, 16)
export const JMPREFDATA = createRefInstr(0xdb3e, 16)
export const IFREF = createRefInstr(0xe300, 16)
export const IFNOTREF = createRefInstr(0xe301, 16)
export const IFJMPREF = createRefInstr(0xe302, 16)
export const IFNOTJMPREF = createRefInstr(0xe303, 16)
export const IFREFELSE = createRefInstr(0xe30d, 16)
export const IFELSEREF = createRefInstr(0xe30e, 16)

export const IFREFELSEREF = (trueBranch: Instr[], falseBranch: Instr[]): Instr => {
    return {
        store: (b: Builder) => {
            b.storeUint(0xe30f, 16)
            b.storeRef(compileCell(trueBranch))
            b.storeRef(compileCell(falseBranch))
        },
    }
}

export const IFBITJMPREF_BASE = (neg: boolean, num: number, instructions: Instr[]): Instr => {
    return {
        store: (b: Builder) => {
            b.storeUint(0xe3c0 >> 6, 10)

            b.storeBit(neg) // if negation
            uint(5).store(num, b)
            b.storeRef(compileCell(instructions))
        },
    }
}
// IFBITJMPREF: cat('continuation_cond_loop', mkext(1, 0xe3c >> 1, 11, 5, seq1(uint(5)), `exec_if_bit_jmpref`)),
export const IFBITJMPREF = (bit_idx: number, instructions: Instr[]) =>
    IFBITJMPREF_BASE(false, bit_idx, instructions)

// IFNBITJMPREF: cat('continuation_cond_loop', mkext(1, 0xe3c >> 1, 11, 5, seq1(uint(5)), `exec_if_bit_jmpref`)),
export const IFNBITJMPREF = (bit_idx: number, instructions: Instr[]) =>
    IFBITJMPREF_BASE(true, bit_idx, instructions)
// END SECTION

// SECTION: sdbegins
export const SDBEGINS_BASE = (prefix: number, slice: Slice): Instr => {
    return {
        store: (b: Builder) => {
            b.storeUint(prefix, 14)

            const length = slice.remainingBits + 1

            const y = Math.ceil((length - 3) / 8)
            b.storeUint(y, 7)

            b.storeSlice(slice)

            b.storeUint(0x1, 1)
            const realLength = y * 8 + 3
            if (realLength - length > 0) {
                b.storeUint(0x0, realLength - length)
            }
        },
    }
}
// SDBEGINS: cat('cell_deserialize', mkext(0, 0xd728 >> 2, 14, 7, slice(uint(7), 3), `exec_slice_begins_with_const`)),
export const SDBEGINS = (slice: Slice) => SDBEGINS_BASE(0xd728 >> 2, slice)
// SDBEGINSQ: cat('cell_deserialize', mkext(0, 0xd72c >> 2, 14, 7, slice(uint(7), 3), `exec_slice_begins_with_const`)),
export const SDBEGINSQ = (slice: Slice) => SDBEGINS_BASE(0xd72c >> 2, slice)
// END SECTION

export const PUSHINT_LONG = (val: bigint) => {
    return {
        // 88
        //
        // PUSHINT_3: cat('int_const', mkextrange(0, 0x820 << 1, (0x820 << 1) + 31, 13, 5, largeInt, `exec_push_int`)),

        // D320840116683045_

        // 0x82 10 8B341822
        //         8b341822

        store: (b: Builder) => {
            b.storeUint(0x82, 8)
            largeInt.store(val, b)
        },
    }
}

export const STSLICECONST = (slice: Slice): Instr => {
    if (slice.remainingBits >= 8 * 7 + 2) {
        throw new Error("too big slice")
    }

    return {
        // CFC0_xysss
        //
        // STSLICECONST: cat('cell_serialize', mkext(0, 0xcf8 >> 1, 11, 3, slice(uint(3), 2), `exec_store_const_slice`)),
        // STSLICECONST_2: cat('cell_serialize', mkext(1, 0xcfa >> 1, 11, 3, slice(uint(3), 2), `exec_store_const_slice`)),
        // STSLICECONST_3: cat('cell_serialize', mkext(2, 0xcfc >> 1, 11, 3, slice(uint(3), 2), `exec_store_const_slice`)),
        // STSLICECONST_4: cat('cell_serialize', mkext(3, 0xcfe >> 1, 11, 3, slice(uint(3), 2), `exec_store_const_slice`)),

        store: (b: Builder) => {
            // 0xCFC0_ 6_

            const refs = slice.remainingRefs
            if (refs === 0) {
                b.storeUint(0xcf8 >> 1, 11)
            } else if (refs === 1) {
                b.storeUint(0xcfa >> 1, 11)
            } else if (refs === 2) {
                b.storeUint(0xcfc >> 1, 11)
            } else if (refs === 3) {
                b.storeUint(0xcfe >> 1, 11)
            }

            // 11010011110010001100111110001 000010000000000 1000 11001111001100011111001011110000
            // 11010011110010001100111110001 000010000000000 0000 11001111001100011111001011110000
            // 11010011110010001100111110001 000000001000000 0000 11001111001100011111001011110000
            // 11010011110010001100111110001 000010000000000 1000 11001111001100011111001011110000

            // 1101001111001000
            //
            // 1100111110000001
            // 110011111000010010000000
            // 110011111000010001000000
            // 110011111000010000100000
            // 110011111000010000010000
            // 110011111000010000001000
            // 110011111000010000000100
            // 110011111000010000000010
            // 110011111000010000000001
            // 11001111001100011111001011110000

            // x{}    STSLICECONST                      110011111 00 000 10
            // x{4_}  STSLICECONST  0           0 100   110011111 00 000 01
            // x{2_}  STSLICECONST  00          00 10   110011111 00 001 0010000000
            // x{1_}  STSLICECONST  000         000 1   110011111 00 001 0001000000
            // x{0}   STSLICECONST  0000        0000    110011111 00 001 0000100000
            // x{04_} STSLICECONST  0000 0              110011111 00 001 0000010000
            // x{02_} STSLICECONST  0000 00             110011111 00 001 0000001000
            // x{01_} STSLICECONST  0000 000            110011111 00 001 0000000100
            // x{00}  STSLICECONST  0000 0000           110011111 00 001 0000000010
            // x{004_} STSLICECONST 0000 0000 0         110011111 00 001 0000000001
            //                                          0xcf
            //
            // BBITS: 1100111100110001

            const length = slice.remainingBits + 1

            const y = Math.ceil((length - 2) / 8)
            b.storeUint(y, 3)

            b.storeSlice(slice)

            b.storeUint(0x1, 1)

            const realLength = y * 8 + 2
            if (realLength - length > 0) {
                b.storeUint(0x0, realLength - length)
            }
        },
    }
}
