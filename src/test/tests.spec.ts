import {
    compileCell,
    Instr,
    BBITS,
    NEWC,
    STSLICECONST,
    THROWANY,
    THROWARG,
    SETCP,
    PUSHINT_LONG,
    DICTIGETJMPZ,
    PUSHDICTCONST,
    IFELSE,
    PUSHCONT_SHORT,
    THROW_SMALL,
    SDBEGINSX,
    SBITS,
    SDBEGINS,
} from "../instructions"
import {beginCell, Cell} from "@ton/core"
import {compileFunc} from "@ton-community/func-js"
import {AssemblyWriter, disassembleRoot} from "@tact-lang/opcode"

interface TestCase {
    readonly name: string
    readonly instructions: Instr[]
    readonly funcCode: string
}

const TESTS: TestCase[] = [
    {
        name: "STSLICECONST",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                new Map([
                    // prettier-ignore
                    [0, [
                        NEWC(),
                        STSLICECONST(beginCell().storeUint(0b0, 1).asSlice()),
                        STSLICECONST(beginCell().storeUint(0b0, 2).asSlice()),
                        STSLICECONST(beginCell().storeUint(0b0, 3).asSlice()),
                        STSLICECONST(beginCell().storeUint(0b0, 4).asSlice()),
                        STSLICECONST(beginCell().storeUint(0b0, 5).asSlice()),
                        STSLICECONST(beginCell().storeUint(0b0, 6).asSlice()),
                        STSLICECONST(beginCell().storeUint(0b0, 7).asSlice()),
                        STSLICECONST(beginCell().storeUint(0b0, 8).asSlice()),
                        STSLICECONST(beginCell().storeUint(0b0, 9).asSlice()),
                        BBITS(),
                        THROWANY(),
                    ]],
                ]),
            ),
            DICTIGETJMPZ(),
            THROWARG(11),
        ],
        funcCode: `
            builder begin_cell() asm "NEWC";
            int builder_bits(builder b) asm "BBITS";

            builder store_slice1(builder b) asm "b{0} STSLICECONST";
            builder store_slice2(builder b) asm "b{00} STSLICECONST";
            builder store_slice3(builder b) asm "b{000} STSLICECONST";
            builder store_slice4(builder b) asm "b{0000} STSLICECONST";
            builder store_slice5(builder b) asm "b{00000} STSLICECONST";
            builder store_slice6(builder b) asm "b{000000} STSLICECONST";
            builder store_slice7(builder b) asm "b{0000000} STSLICECONST";
            builder store_slice8(builder b) asm "b{00000000} STSLICECONST";
            builder store_slice9(builder b) asm "b{000000000} STSLICECONST";
            
            () recv_internal() impure {
                throw(begin_cell()
                    .store_slice1()
                    .store_slice2()
                    .store_slice3()
                    .store_slice4()
                    .store_slice5()
                    .store_slice6()
                    .store_slice7()
                    .store_slice8()
                    .store_slice9()
                    .builder_bits());
            }`,
    },

    {
        name: "PUSHINT_LONG",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                new Map([
                    // prettier-ignore
                    [0, [
                    PUSHINT_LONG(99999999999999999n), THROWANY()
                ]
            ],
                ]),
            ),
            DICTIGETJMPZ(),
            THROWARG(11),
        ],
        funcCode: `
            () recv_internal() impure {
                throw(99999999999999999);
            }`,
    },

    {
        name: "IF-ELSE",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                // prettier-ignore
                new Map([[0, [
                    PUSHCONT_SHORT([
                        THROW_SMALL(1),
                    ]),
                    PUSHCONT_SHORT([
                        THROW_SMALL(2),
                    ]),
                    IFELSE(),
                ]]]),
            ),
            DICTIGETJMPZ(),
            THROWARG(11),
        ],
        funcCode: `
            () recv_internal(int cond) impure {
                if (cond) {
                    throw(1);
                } else {
                    throw(2);
                }
            }`,
    },
    {
        name: "SDBEGINSX",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                // prettier-ignore
                new Map([[0, [
                    SDBEGINSX(),
                    SBITS(),
                    THROWANY(),
                ]]]),
            ),
            DICTIGETJMPZ(),
            THROWARG(11),
        ],
        funcCode: `
            slice sd_begins(slice where, slice to_find) asm "SDBEGINSX";
            int bits(slice where) asm "SBITS";
        
            () recv_internal(slice s1, slice s2) impure {
                var s3 = sd_begins(s1, s2);
                throw(bits(s3));
            }`,
    },
    {
        name: "SDBEGINS",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                // prettier-ignore
                new Map([[0, [
                    SDBEGINS(beginCell().storeUint(0n, 4).asSlice()),
                    SBITS(),
                    THROWANY(),
                ]]]),
            ),
            DICTIGETJMPZ(),
            THROWARG(11),
        ],
        funcCode: `
            slice sd_begins(slice where) asm "b{0000} SDBEGINS";
            int bits(slice where) asm "SBITS";
        
            () recv_internal(slice s1) impure {
                var s3 = sd_begins(s1);
                throw(bits(s3));
            }`,
    },
]

describe("tests", () => {
    TESTS.forEach(({name, instructions, funcCode}: TestCase) => {
        it(`Test ${name}`, async () => {
            const compiled = compileCell(instructions)
            const funcCompiled = await compile(funcCode)

            const actual = compiled.toString()
            const expected = funcCompiled[0].toString()

            if (actual !== expected) {
                const fift = funcCompiled[1]
                console.log(fift)

                const disasn = disassembleRoot(funcCompiled[0], {computeRefs: false})
                console.log(AssemblyWriter.write(disasn, {outputBitcodeAfterInstruction: true}))

                const disasn2 = disassembleRoot(compiled, {computeRefs: false})
                console.log(AssemblyWriter.write(disasn2, {outputBitcodeAfterInstruction: true}))
            }

            expect(actual).toEqual(expected)
        })
    })
})

const compile = async (code: string): Promise<[Cell, string]> => {
    const res = await compileFunc({
        sources: [
            {
                content: code,
                filename: "source",
            },
        ],
    })
    if (res.status === "error") {
        throw new Error("cannot compile FunC")
    }

    return [Cell.fromBase64(res.codeBoc), res.fiftCode]
}
