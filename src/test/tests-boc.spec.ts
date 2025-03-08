import {Instr, compileCell} from "../instructions"
import {instructions as jettonMinterInstructions} from "./testdata/jetton_minter_discoverable_JettonMinter.tasm"
import {instructions as escrowInstructions} from "./testdata/escrow_Escrow.tasm"
import {instructions as simpleCounterInstructions} from "./testdata/test_SimpleCounter.tasm"
import {instructions as someContractInstructions} from "./testdata/SomeContract.tasm"
import {instructions as someContract2Instructions} from "./testdata/SomeContract2.tasm"
import * as path from "node:path"
import * as fs from "node:fs"
import {Cell} from "@ton/core"

interface TestCase {
    readonly name: string
    readonly instructions: Instr[]
    readonly bocPath?: string
    readonly hexPath?: string
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
    {
        name: "Escrow",
        instructions: escrowInstructions,
        bocPath: path.join(__dirname, "testdata", "escrow_Escrow.boc"),
    },
    {
        name: "SomeContract",
        instructions: someContractInstructions,
        hexPath: path.join(__dirname, "testdata", "SomeContract.hex"),
    },
    {
        name: "SomeContract2",
        instructions: someContract2Instructions,
        hexPath: path.join(__dirname, "testdata", "SomeContract2.hex"),
    },
]

describe("tests", () => {
    TESTS.forEach(({name, instructions, bocPath, hexPath}: TestCase) => {
        it(`Test ${name}`, async () => {
            const compiled = compileCell(instructions)
            const expectedBoc = bocPath
                ? Cell.fromBoc(fs.readFileSync(bocPath))[0]
                : hexPath
                  ? Cell.fromHex(fs.readFileSync(hexPath, "utf8").trim())
                  : new Cell()

            expect(compiled.toString()).toEqual(expectedBoc.toString())
        })
    })
})
