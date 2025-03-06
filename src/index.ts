import {beginCell, Cell} from "@ton/core"
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
} from "./instructions"
import {visualizeBoc} from "./utils/debug"

const instructions = [
    SETCP(0),
    PUSHDICTCONST(
        new Map([
            // prettier-ignore
            [0, [
                NEWC(),
                // STSLICECONST(beginCell().storeBits(new BitString(Buffer.from("1000", "hex"), 0, 14)).asSlice()),
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
