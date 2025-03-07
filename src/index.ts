import {Cell} from "@ton/core"
import {disassembleRoot} from "@tact-lang/opcode"
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
import * as i from "./instructions"
import {visualizeBoc} from "./utils/debug"
import {execute} from "./instructions/helpers"
import {TSAssemblyWriter} from "../scripts/printer/ts-assembly-writer"
import * as fs from "node:fs"

// const instructions = [
//     SETCP(0),
//     PUSHDICTCONST(
//         new Map([
//             // prettier-ignore
//             [0, [
//
//             ]],
//         ]),
//     ),
//     DICTIGETJMPZ(),
//     THROWARG(11),
// ]

// const instructions = [
//     i.SETCP(0),
//     i.PUSHDICTCONST(new Map([
//         [0, [
//             i.POP(0),
//             i.SWAP(),
//             i.CTOS(),
//             i.PUSHINT(2),
//             i.SDSKIPFIRST(),
//             i.LDI(1),
//             i.LDI(1),
//             i.LDMSGADDR(),
//             i.PUSH(1),
//             i.XCHG_1([3, 4]),
//             i.XCHG2(6 , 6),
//             i.TUPLE(4),
//             i.SETGLOB(1),
//             i.XCHG_0(2),
//             i.SETGLOB(2),
//             i.PUSHCTR(4),
//             i.CTOS(),
//             i.LDI(1),
//             i.SWAP(),
//             i.PUSHCONT_SHORT([
//                 i.LDU(32),
//                 i.LDU(32),
//                 i.ROTREV(),
//                 i.BLKDROP2([1 , 2]),
//             ]),
//             i.PUSHCONT_SHORT([
//                 i.PUSHINT_16(257),
//                 i.LDIX(),
//                 i.SWAP(),
//                 i.SWAP(),
//                 i.ENDS(),
//                 i.PUSHINT(0),
//             ]),
//             i.IFELSE(),
//             i.XCHG_0(3),
//             i.PUSHCONT_SHORT([
//                 i.BLKDROP(3),
//             ]),
//             i.IFJMP(),
//             i.PUSHINT(0),
//             i.PUSH(2),
//             i.SBITS(),
//             i.PUSH(0),
//             i.GTINT(31),
//             i.PUSHCONT_SHORT([
//                 i.POP(1),
//                 i.XCHG_0(2),
//                 i.LDU(32),
//                 i.XCHG_0(3),
//             ]),
//             i.IF(),
//             i.PUSH(1),
//             i.PUSHINT_LONG(2335447074n),
//             i.EQUAL(),
//             i.PUSHCONT([
//                 i.DROP2(),
//                 i.SWAP(),
//                 i.LDU(64),
//                 i.LDU(32),
//                 i.ROTREV(),
//                 i.BLKDROP2([2 , 1]),
//                 i.XCHG_1([1, 2]),
//                 i.ADD(),
//                 i.NEWC(),
//                 i.PUSHINT(-1),
//                 i.SWAP(),
//                 i.STI(1),
//                 i.ROTREV(),
//                 i.XCHG_0(2),
//                 i.STU(32),
//                 i.STU(32),
//                 i.ENDC(),
//                 i.POPCTR(4),
//             ]),
//             i.IFJMP(),
//             i.POP(3),
//             i.EQINT(0),
//             i.XCHG_0(2),
//             i.LESSINT(33),
//             i.XCHG_1([1, 2]),
//             i.AND(),
//             i.IFJMPREF([
//                 i.SWAP(),
//                 i.NEWC(),
//                 i.PUSHINT(-1),
//                 i.SWAP(),
//                 i.STI(1),
//                 i.ROTREV(),
//                 i.XCHG_0(2),
//                 i.STU(32),
//                 i.STU(32),
//                 i.ENDC(),
//                 i.POPCTR(4),
//             ]),
//             i.DROP2(),
//             i.THROW(130),
//         ]],
//         [65536, [
//             i.PUSHCTR(4),
//             i.CTOS(),
//             i.LDI(1),
//             i.SWAP(),
//             i.PUSHCONT_SHORT([
//                 i.LDU(32),
//                 i.LDU(32),
//                 i.ROTREV(),
//                 i.BLKDROP2([1 , 2]),
//             ]),
//             i.PUSHCONT_SHORT([
//                 i.PUSHINT_16(257),
//                 i.LDIX(),
//                 i.SWAP(),
//                 i.SWAP(),
//                 i.ENDS(),
//                 i.PUSHINT(0),
//             ]),
//             i.IFELSE(),
//             i.CALLREF([
//                 i.PUSH(0),
//             ]),
//             i.BLKDROP2([2 , 1]),
//         ]],
//         [105872, [
//             i.PUSHCTR(4),
//             i.CTOS(),
//             i.LDI(1),
//             i.SWAP(),
//             i.PUSHCONT_SHORT([
//                 i.LDU(32),
//                 i.LDU(32),
//                 i.ROTREV(),
//                 i.BLKDROP2([1 , 2]),
//             ]),
//             i.PUSHCONT_SHORT([
//                 i.PUSHINT_16(257),
//                 i.LDIX(),
//                 i.SWAP(),
//                 i.SWAP(),
//                 i.ENDS(),
//                 i.PUSHINT(0),
//             ]),
//             i.IFELSE(),
//             i.CALLREF([
//                 i.PUSH(1),
//             ]),
//             i.BLKDROP2([2 , 1]),
//         ]],
//     ])),
//     i.DICTIGETJMPZ(),
//     i.THROWARG(11),
// ];
//
// const codeCell = compileCell(instructions)
//
// console.log("cell:   ", codeCell)
// // const ourBoc = codeCell.toBoc();
// // console.log(ourBoc)
// // console.log(ourBoc.toString("base64"))
//
// visualizeBoc(codeCell, "our:  ")

type Data = {
    contracts: {
        code: string
    }[]
}

const jsonData = JSON.parse(fs.readFileSync(`${__dirname}/test/contracts.json`, "utf8")) as Data
const firstContract = jsonData.contracts[100015]

console.log(firstContract.code)
const funcBoc = Cell.fromHex(firstContract.code)

// const funcBoc = Cell.fromBase64(
//     "te6ccgEBAgEALwABFP8A9KQT9LzyyAsBAEDTyM+Bz4SAz4RAz4Qgz4QQz4QIz4QEz4QCz4QBzzHy8A==",
// )
console.log("funcBoc:", funcBoc)
console.log("funcBoc:", funcBoc.toBoc().toString("hex"))

visualizeBoc(funcBoc, "func: ")

const disasn = disassembleRoot(funcBoc, {computeRefs: false})
// const disasn = disassembleAndProcess({source: funcBoc})

// console.log(AssemblyWriter.write(disasn, {outputBitcodeAfterInstruction: true}))

fs.writeFileSync(
    `${__dirname}/testing/foo.tasm.ts`,
    TSAssemblyWriter.write(disasn, {outputBitcodeAfterInstruction: true}),
)
