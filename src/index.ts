import {beginCell, Builder, Cell} from "@ton/core"
import {AssemblyWriter, disassembleRoot} from "@tact-lang/opcode"
import {
    BBITS,
    NEWC,
    THROWANY,
    THROWARG,
    SETCP,
    DICTIGETJMPZ,
    PUSHDICTCONST,
    STSLICECONST,
    compileCell,
    Instr,
    PUSHINT,
    ADD,
    PUSHCONT,
    EXECUTE,
} from "./instructions"
import {visualizeBoc} from "./utils/debug"
import {execute} from "./instructions/helpers"

const instructions = [
    SETCP(0),
    PUSHDICTCONST(
        new Map([
            // prettier-ignore
            [0, [

            ]],
        ]),
    ),
    DICTIGETJMPZ(),
    THROWARG(11),
]

const codeCell = compileCell(instructions)

console.log("cell:   ", codeCell)
// const ourBoc = codeCell.toBoc();
// console.log(ourBoc)
// console.log(ourBoc.toString("base64"))

visualizeBoc(codeCell, "our:  ")

const funcBoc = Cell.fromBase64(
    "te6ccgEBAgEALwABFP8A9KQT9LzyyAsBAEDTyM+Bz4SAz4RAz4Qgz4QQz4QIz4QEz4QCz4QBzzHy8A==",
)
console.log("funcBoc:", funcBoc)

visualizeBoc(funcBoc, "func: ")

const disasn = disassembleRoot(codeCell, {computeRefs: false})
// const disasn = disassembleAndProcess({source: codeCell})
console.log(AssemblyWriter.write(disasn, {outputBitcodeAfterInstruction: true}))
