import {IFELSE, PUSHCONT, PUSHCONT_SHORT, PUSHINT, measureGas} from "./instructions"

async function main() {
    // "ZERO SWAP STU($X)", "PUSHINT($X) STZEROES"

    console.log(
        await measureGas([
            PUSHINT(0),
            PUSHCONT_SHORT([PUSHINT(0)]),
            PUSHCONT_SHORT([PUSHINT(1)]),
            IFELSE(),
        ]),
    )

    console.log(
        await measureGas([PUSHINT(0), PUSHCONT([PUSHINT(0)]), PUSHCONT([PUSHINT(1)]), IFELSE()]),
    )
}

void main()

//
// const buffer = ""
//
// console.log(buffer)
// const funcBoc = Cell.fromHex(buffer)
// console.log(funcBoc)
// // visualizeBoc(funcBoc, "func:")
//
// // const funcBoc = Cell.fromBase64(
// //     "te6ccgEBAgEALwABFP8A9KQT9LzyyAsBAEDTyM+Bz4SAz4RAz4Qgz4QQz4QIz4QEz4QCz4QBzzHy8A==",
// // )
// // console.log("funcBoc:", funcBoc)
// // console.log("funcBoc:", funcBoc.toBoc().toString("hex"))
//
// // visualizeBoc(funcBoc, "func: ")
//
// const disasn = disassembleRoot(funcBoc, {computeRefs: false})
// // const disasn = disassembleAndProcess({source: funcBoc})
//
// // console.log(AssemblyWriter.write(disasn, {outputBitcodeAfterInstruction: true}))
//
// const cellString = `\n\nexport const cellData = \`${funcBoc}\`;`
//
// fs.writeFileSync(
//     `${__dirname}/testing/foo.tasm.ts`,
//     AssemblyWriter.write(disasn, {outputBitcodeAfterInstruction: true}) + cellString,
// )
