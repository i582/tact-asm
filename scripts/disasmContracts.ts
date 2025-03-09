import {AssemblyWriter, Cell, disassembleRoot} from "opcode"
import * as fs from "node:fs"

type Data = {
    contracts: {
        code: string
    }[]
}

const data = JSON.parse(fs.readFileSync(`${__dirname}/../src/test/contracts.json`, "utf8")) as Data

data.contracts.forEach((contract, index) => {
    try {
        const contractCell = Cell.fromHex(contract.code)
        const astNode = disassembleRoot(contractCell, {computeRefs: false})

        const result = AssemblyWriter.write(astNode, {
            outputBitcodeAfterInstruction: true,
        }).replaceAll(`"../../instructions`, `"../../../instructions`)

        const importDiff = 'import {diffChars} from "diff"\n\n'
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
        fs.mkdirSync(`${__dirname}/../src/testing/out/${directory}`, {recursive: true})

        fs.writeFileSync(
            `${__dirname}/../src/testing//out/${directory}/${indexString}.tasm.ts`,
            importDiff + result + cellString + bocHex + footer,
        )

        console.log(index + `\r`)
    } catch (e) {
        fs.appendFileSync(
            `${__dirname}/testing/_errors.txt`,
            // @ts-ignore
            index.toString() + ": " + e.toString() + "\n\n",
        )
    }
})
