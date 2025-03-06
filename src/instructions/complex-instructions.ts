import {compileCell, Instr} from "./instr"
import {beginCell, Builder, Cell, Dictionary, DictionaryValue, Slice} from "@ton/core"
import {largeInt} from "./asm1"

export type EPS = Instr

export const EPS = (): EPS => {
    return {
        store: (_: Builder) => {},
    }
}

export const THROW = (arg: bigint): Instr => {
    return {
        store: (b: Builder) => {
            b.storeUint(0xf20 | (Number(arg) >> 4), 12)
            b.storeUint(Number(arg) & 15, 4)
        },
    }
}

export const XCHG_0 = (arg: number) => {
    return {
        store: (b: Builder) => {
            b.storeUint(0x02 | (arg & 15), 8)
        },
    }
}

export const PUSHDICTCONST = (mapping: Map<number, Instr[]>): Instr => {
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
            const dict = Dictionary.empty<number, Cell>(Dictionary.Keys.Int(19), createCodeCell())
            mapping.entries().forEach(entry => {
                const [id, instructions] = entry
                const cell = compileCell(instructions)
                dict.set(id, cell)
            })

            b.storeUint(0xf4a400 >> 11, 13) // 0b1111010010100110
            b.storeUint(1, 1)

            b.storeRef(beginCell().storeDictDirect(dict).endCell())

            b.storeUint(19, 10)
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
            b.storeUint(0x8e8 >> 3, 9)
            b.storeUint(0, 1) // r
            b.storeUint(0, 2) // xx
            b.storeUint(0, 4) // cccc

            const cell = compileCell(instructions)

            b.storeRef(cell)
        },
    }
}

export const CALLREF = (instructions: Instr[]) => {
    return {
        // DB3C
        //
        // CALLREF: cat('continuation_jump', mkext(1, 0xdb3c, 16, 0, noArgs, `(_1, _2, _3, _4) => exec_do_with_ref(_1, _2, _4, (st, cont) => st.call((cont)), 'CALLREF')`)),

        store: (b: Builder) => {
            b.storeUint(0xdb3c, 16)

            const cell = compileCell(instructions)
            b.storeRef(cell)
        },
    }
}

export const IFREFELSE = (instructions: Instr[]) => {
    return {
        // E30D
        //
        // IFREFELSE: cat('continuation_cond_loop', mkext(1, 0xe30d, 16, 0, noArgs, `(_1, _2, _3, _4) => exec_ifelse_ref(_1, _2, _4, true)`)),

        store: (b: Builder) => {
            b.storeUint(0xe30d, 16)

            const cell = compileCell(instructions)
            b.storeRef(cell)
        },
    }
}

export const IFJMPREF = (instructions: Instr[]) => {
    return {
        // E302
        //
        // IFJMPREF: cat('continuation_cond_loop', mkext(1, 0xe302, 16, 0, noArgs, `(_1, _2, _3, _4) => exec_do_with_cell(1, _2, _4, (st, cell) => st.get_stack().pop_bool() ? st.jump(st.ref_to_cont((cell))) : 0, 'IFJMPREF')`)),

        store: (b: Builder) => {
            b.storeUint(0xe302, 16)

            const cell = compileCell(instructions)
            b.storeRef(cell)
        },
    }
}

export const PUSHREF = (instructions: Instr[]) => {
    return {
        // 88
        //
        // PUSHREF: cat('cell_const', mkext(1, 0x88, 8, 0, noArgs, `(_1, _2, _3, _4) => exec_push_ref(_1, _2, 0, _4)`)),

        store: (b: Builder) => {
            b.storeUint(0x88, 8)

            const cell = compileCell(instructions)
            b.storeRef(cell)
        },
    }
}

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

export const STSLICECONST = (slice: Slice) => {
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

            b.storeUint(0xcf80 >> 7, 9)

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
            b.storeUint(0, 2)
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
