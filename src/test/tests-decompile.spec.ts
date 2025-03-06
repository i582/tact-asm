import {
    compileCell,
    Instr,
    THROWARG,
    SETCP,
    DICTIGETJMPZ,
    PUSHDICTCONST,
    IFBITJMPREF,
    PUSHINT,
    ADD,
    IFNBITJMPREF,
} from "../instructions"
import {AssemblyWriter, disassembleRoot} from "@tact-lang/opcode"

interface TestCase {
    readonly name: string
    readonly instructions: Instr[]
    readonly expected: string
}

const TESTS: TestCase[] = [
    {
        name: "IFBITJMPREF",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                new Map([
                    // prettier-ignore
                    [0, [
                        IFBITJMPREF(2, [
                            PUSHINT(1),
                            PUSHINT(1),
                            ADD(),
                        ])
                    ]],
                ]),
            ),
            DICTIGETJMPZ(),
            THROWARG(11),
        ],
        expected: `"Asm.fif" include
PROGRAM{
  DECLPROC recv_internal
  recv_internal PROC:<{
    2 <{
      1 PUSHINT
      1 PUSHINT
      ADD
    }>c IFBITJMPREF
  }>
}END>c`,
    },
    {
        name: "IFNBITJMPREF",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                new Map([
                    // prettier-ignore
                    [0, [
                        IFNBITJMPREF(2, [
                            PUSHINT(1),
                            PUSHINT(1),
                            ADD(),
                        ])
                    ]],
                ]),
            ),
            DICTIGETJMPZ(),
            THROWARG(11),
        ],
        expected: `"Asm.fif" include
PROGRAM{
  DECLPROC recv_internal
  recv_internal PROC:<{
    2 <{
      1 PUSHINT
      1 PUSHINT
      ADD
    }>c IFNBITJMPREF
  }>
}END>c`,
    },
]

describe("tests with decompiled", () => {
    TESTS.forEach(({name, instructions, expected}: TestCase) => {
        it(`Test ${name}`, async () => {
            const compiled = compileCell(instructions)

            const disasn = disassembleRoot(compiled, {computeRefs: false})
            const disasnRes = AssemblyWriter.write(disasn, {useAliases: false, withoutHeader: true})

            expect(disasnRes).toEqual(expected)
        })
    })
})
