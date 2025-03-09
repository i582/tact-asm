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
    MUL,
    PUSHSLICE,
    hex,
    PUSHSLICE_LONG,
} from "../instructions"
import {AssemblyWriter, disassembleRoot} from "@tact-lang/opcode"
import {call, execute} from "../instructions/helpers"

interface TestCase {
    readonly name: string
    readonly instructions: Instr[]
    readonly expected: string
}

const someFunction = (): Instr[] => [MUL(), ADD()]

const TESTS: TestCase[] = [
    {
        name: "IFBITJMPREF",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                19,
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
                19,
                new Map([
                    // prettier-ignore
                    [0, [
                        IFNBITJMPREF(2, [
                            PUSHINT(1),
                            PUSHINT(2),
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
      2 PUSHINT
      ADD
    }>c IFNBITJMPREF
  }>
}END>c`,
    },

    {
        name: "call",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                19,
                new Map([
                    // prettier-ignore
                    [0, [
                        call(ADD(), [PUSHINT(1), PUSHINT(2)])
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
    1 PUSHINT
    2 PUSHINT
    ADD
  }>
}END>c`,
    },

    {
        name: "execute",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                19,
                new Map([
                    // prettier-ignore
                    [0, [
                        execute(someFunction, PUSHINT(1), PUSHINT(2), PUSHINT(3))
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
    1 PUSHINT
    2 PUSHINT
    3 PUSHINT
    <{
      MUL
      ADD
    }> PUSHCONT
    EXECUTE
  }>
}END>c`,
    },

    {
        name: "PUSHSLICE",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                19,
                new Map([
                    // prettier-ignore
                    [0, [
                        PUSHSLICE(hex("6_")),
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
    x{6_} PUSHSLICE
  }>
}END>c`,
    },
    {
        name: "PUSHSLICE_LONG",
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                19,
                new Map([
                    // prettier-ignore
                    [0, [
                        PUSHSLICE_LONG(hex("6_")),
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
    x{6_} PUSHSLICE
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
