import {compileCell, Instr, BBITS, NEWC, STSLICECONST, THROWANY, THROWARG, SETCP, PUSHINT_LONG, DICTIGETJMPZ, PUSHDICTCONST} from "../instructions";
import {beginCell, Cell} from "@ton/core";
import {compileFunc} from "@ton-community/func-js";

interface TestCase {
    readonly name: string,
    readonly instructions: Instr[],
    readonly funcCode: string,
}

const TESTS: TestCase[] = [
    {
        name: "STSLICECONST",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(new Map([
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
            ])),
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
            }`
    },

    {
        name: "PUSHINT_LONG",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(new Map([
                [0, [
                    PUSHINT_LONG(99999999999999999n),
                    THROWANY(),
                ]],
            ])),
            DICTIGETJMPZ(),
            THROWARG(11),
        ],
        funcCode: `
            () recv_internal() impure {
                throw(99999999999999999);
            }`
    }
]

describe('tests', () => {
    TESTS.forEach(({name, instructions, funcCode}: TestCase) => {
        it(`Test ${name}`, async () => {
            const compiled = compileCell(instructions)
            const funcCompiled = await compile(funcCode)

            const actual = compiled.toString();
            const expected = funcCompiled.toString();
            expect(actual).toEqual(expected)
        })
    });
});

const compile = async (code: string): Promise<Cell> => {
    const res = await compileFunc({
        sources: [
            {
                content: code,
                filename: "source"
            }
        ]
    })
    if (res.status === "error") {
        throw new Error("cannot compile FunC")
    }

    return Cell.fromBase64(res.codeBoc)
}
