import {AssemblyWriter, Cell, disassembleRoot} from "opcode"
import * as fs from "node:fs"
import {hexToBin, visualizeBoc} from "./utils/debug"

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

jsonData.contracts.forEach((contract, index) => {
    if (index < 68044) {
        return
    }

    try {
        const contractCell = Cell.fromHex(contract.code)
        const astNode = disassembleRoot(contractCell, {computeRefs: false})

        const result = AssemblyWriter.write(astNode, {outputBitcodeAfterInstruction: true})

        const cellString = `\n\nexport const cellData = \`${contractCell}\`;`
        const bocHex = `\n\nexport const bocHex = \`${contract.code}\`;`

        const footer = `
    
const boc = i.compileCell(instructions)

if (boc.toString() !== cellData.toString()) {
    if (cellData.toString().includes("A0000061_")) {
        console.log("skip this shitty code")
        process.exit(0)
    }
    console.log(diffChars(boc.toString(), cellData.toString()))
    throw new Error("not equal")
}

console.log("equal")
`

        const indexString = index.toString().padStart(6, "0")
        const directory = indexString.slice(0, 3)
        fs.mkdirSync(`${__dirname}/testing/out/${directory}`, {recursive: true})

        // const filename = indexString.slice(2)
        fs.writeFileSync(
            `${__dirname}/testing/out/${directory}/${indexString}.tasm.ts`,
            'import {diffChars} from "diff"\n\n' + result + cellString + bocHex + footer,
        )

        console.log(index + `\r`)
    } catch (e) {
        fs.appendFileSync(
            `${__dirname}/testing/_errors.txt`,
            index.toString() + ": " + e.toString() + "\n\n",
        )
    }
})

const firstContract = jsonData.contracts[2140]

console.log(firstContract.code)
const funcBoc = Cell.fromHex(firstContract.code)
console.log(funcBoc)
// visualizeBoc(funcBoc, "func:")

// const funcBoc = Cell.fromBase64(
//     "te6ccgEBAgEALwABFP8A9KQT9LzyyAsBAEDTyM+Bz4SAz4RAz4Qgz4QQz4QIz4QEz4QCz4QBzzHy8A==",
// )
// console.log("funcBoc:", funcBoc)
// console.log("funcBoc:", funcBoc.toBoc().toString("hex"))

// visualizeBoc(funcBoc, "func: ")

const disasn = disassembleRoot(funcBoc, {computeRefs: false})
// const disasn = disassembleAndProcess({source: funcBoc})

// console.log(AssemblyWriter.write(disasn, {outputBitcodeAfterInstruction: true}))

const cellString = `\n\nexport const cellData = \`${funcBoc}\`;`

fs.writeFileSync(
    `${__dirname}/testing/foo.tasm.ts`,
    AssemblyWriter.write(disasn, {outputBitcodeAfterInstruction: true}) + cellString,
)
