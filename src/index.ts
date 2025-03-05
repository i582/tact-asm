import {beginCell, BitString, Builder, Cell} from "@ton/core";
import {AssemblyWriter, disassemble, disassembleAndProcess, disassembleRoot} from "@tact-lang/opcode";
import {
    ADD,
    DICTIGETJMPZ,
    PUSHDICTCONST,
    DUMPSTK,
    PUSHINT4,
    SETCP0,
    THROW,
    XCHG_1,
    XCHG3,
    PUSHPOW2,
    GETGLOB, SETGLOB, SETCP_1, SETCP
} from "./instr";
import {
    BBITS,
    CALLREF,
    CTOS,
    ENDC,
    IF,
    IFJMPREF, LDI,
    NEWC,
    PUSHCONT,
    PUSHINT,
    PUSHINT_1,
    PUSHINT_LONG,
    STSLICECONST, THROWANY, THROWARG
} from "./instr-gen";

function visualizeBoc(cell: Cell, name: string) {
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

// 11010011110010001100111110001000010000000000     11001111001100011111001011110000
// 11010011110010001100111110001000010000000000 100011001111001100011111001011110000

const instructions = [
    // SETCP0(),
    SETCP([0]),


    PUSHDICTCONST(new Map([
        [0, [
            // 0xF22_ 2A_

            // PUSHINT4(5n),
            // PUSHINT4(10n),
            // ADD(),

            // 1101001111001000110011111000000111001111100001001000000  11001111100001000100000  11001111100001000010000  11001111100001000001000 11001111100001000000100110011111000010000000101100111110000100000000111001111100001000000000111001111001100011111001011110000
            // 1101001111001000110011111000000111001111100001001000000 0110011111000010001000000 110011111000010000100000 110011111000010000010000 11001111100001000000100011001111100001000000010011001111100001000000001011001111100001000000000111001111001100011111001011110000

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
            // LDI(14),

            // IFJMPREF([
            //     PUSHINT(1),
            // ]),
            // PUSHCONT([
            //     PUSHINT(2),
            // ]),
            // IF(),

            // PUSHINT(1),
            // PUSHINT_1(100),
            // PUSHINT(10),
            // XCHG3(1, 2, 3),
            // PUSHPOW2([5]),
            // GETGLOB([1]),
            // SETGLOB([1]),
            // THROW(10n),
        ]],
    ])),
    DICTIGETJMPZ(),
    THROWARG(11),
    // PUSHINT4(5n),
    // PUSHINT4(3n),
    // PUSHINT4(7n),
    // ADD(),
    // ADD(),
    // DUMPSTK(),
]

const b = new Builder();
instructions.forEach(instruction => instruction.store(b));

// const bits = b.asCell().bits;
// console.log(bits)

// const ourBoc = beginCell()
//     .storeUint(0xb5ee9c72, 32)
//     .storeUint(0b01, 2)
//     .storeUint(0b01, 2)
//     .endCell()

const codeCell = b.endCell()

console.log("cell:   ", codeCell)
// const ourBoc = codeCell.toBoc();
// console.log(ourBoc)
// console.log(ourBoc.toString("base64"))

visualizeBoc(codeCell, "our:  ");

// b5 ee 9c 72 - header
// 10110101111011101001110001110010

// 11111111 00000000 1111010010 10010000010 01111110100 101111001 111001011 00100000001011
// 11111111 00000000 1111010010 10010000010 01111110100 101111001 111001011 00100000001011

const funcBoc = Cell.fromBase64("te6ccgEBAgEALwABFP8A9KQT9LzyyAsBAEDTyM+Bz4SAz4RAz4Qgz4QQz4QIz4QEz4QCz4QBzzHy8A==");
console.log("funcBoc:", funcBoc)

// 1101 0011 1111 0010 0000 1010
visualizeBoc(funcBoc, "func: ");
// 11
//   0
//     1 0011
//            1111 1001 0000 0101 0100

// 11
//   0
//    1 0011
//          1 1010 0000 100

// 1010 0000

// const cell = Cell.fromBoc(ourBoc)[0];
// console.log("from ourBoc:", cell)

const disasn = disassembleRoot(codeCell, {})
// const disasn = disassembleAndProcess({source: codeCell})
console.log(AssemblyWriter.write(disasn, {
    outputBitcodeAfterInstruction: true,
}))

// <{
//   SETCP0                                          // 0xFF 00
//   x{D3F20A} 19 DICTPUSHCONST                      // 0xF4A6_ D3F20A 04E_
//   DICTIGETJMPZ                                    // 0xF4BC
//   11 THROWARG                                     // 0xF2CC_ 017_
// }>c

// te6ccgEBAgEAEgABFP8A9KQT9LzyyAsBAAbT8gE=
// <Buffer b5 ee 9c 72 01 01 02 01 00 12 00 01 14 ff 00 f4 a4 13 f4 bc f2 c8 0b 01 00 06 d3 f2 01>

// funcBoc: x{FF00F4A413F4BCF2C80B}
//  x{D3F20A}
