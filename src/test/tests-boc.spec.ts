import {Instr, compileCell} from "../instructions"
import {instructions as jettonMinterInstructions} from "./testdata/jetton_minter_discoverable_JettonMinter.tasm"
import {instructions as simpleCounterInstructions} from "./testdata/test_SimpleCounter.tasm"
import * as path from "node:path"
import * as fs from "node:fs"
import {Cell} from "@ton/core"

interface TestCase {
    readonly name: string
    readonly instructions: Instr[]
    readonly bocPath: string
}

const TESTS: TestCase[] = [
    {
        name: "SimpleCounter",
        instructions: simpleCounterInstructions,
        bocPath: path.join(__dirname, "testdata", "test_SimpleCounter.boc"),
    },
    {
        name: "JettonMinter",
        instructions: jettonMinterInstructions,
        bocPath: path.join(__dirname, "testdata", "jetton_minter_discoverable_JettonMinter.boc"),
    },
]

describe("tests", () => {
    TESTS.forEach(({name, instructions, bocPath}: TestCase) => {
        it(`Test ${name}`, async () => {
            const compiled = compileCell(instructions)
            const expectedBoc = Cell.fromBoc(fs.readFileSync(bocPath))[0]

            expect(compiled.toString()).toEqual(expectedBoc.toString())
        })
    })
})
