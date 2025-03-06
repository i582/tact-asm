import {Cell} from "@ton/core"

export function visualizeBoc(cell: Cell, name: string) {
    process.stdout.write(name)

    for (let i = 0; i < cell.bits.length; i++) {
        const bit = Number(cell.bits.at(i))
        process.stdout.write(String(bit))
    }

    cell.refs.forEach((cell: Cell, i: number) => {
        process.stdout.write("\n      " + "    ".repeat(i + 1))

        for (let i = 0; i < cell.bits.length; i++) {
            const bit = Number(cell.bits.at(i))
            process.stdout.write(String(bit))
        }
    })

    process.stdout.write("\n")
    process.stdout.write("\n")
}
