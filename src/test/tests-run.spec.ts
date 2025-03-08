import {
    ADD,
    compileCell,
    DICTIGETJMPZ,
    DROP,
    IFBITJMPREF,
    Instr,
    MUL,
    PUSHDICTCONST,
    PUSHINT,
    PUSHINT_16,
    PUSHINT_8,
    SETCP,
    THROWARG,
} from "../instructions"
import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    StateInit,
    toNano,
    TupleBuilder,
    TupleReader,
} from "@ton/core"
import {Blockchain, SandboxContract, TreasuryContract} from "@ton/sandbox"
import {Maybe} from "@ton/core/dist/utils/maybe"
import {execute} from "../instructions/helpers"
import * as i from "../instructions"

interface TestCase {
    readonly name: string
    readonly methodId: number
    readonly instructions: Instr[]
    readonly prepareData: () => Maybe<Cell>
    readonly compareResult: (res: TupleReader) => void
}

const emptyData = () => beginCell().endCell()

const someFunction = (): Instr[] => [MUL(), ADD()]

const TESTS: TestCase[] = [
    {
        name: "IFBITJMPREF true",
        methodId: 0,
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                new Map([
                    // prettier-ignore
                    [0, [
                        PUSHINT_16(999),
                        PUSHINT_8(0b0100),
                        IFBITJMPREF(2, [
                            DROP(),
                            DROP(),
                            PUSHINT(1),
                        ])
                    ]],
                ]),
            ),
            DICTIGETJMPZ(),
            THROWARG(11),
        ],
        prepareData: emptyData,
        compareResult: (res: TupleReader) => {
            const num = res.readBigNumber()
            expect(Number(num)).toEqual(1)
        },
    },
    {
        name: "IFBITJMPREF false",
        methodId: 0,
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                new Map([
                    // prettier-ignore
                    [0, [
                        PUSHINT_16(999),
                        PUSHINT_8(0b0100),
                        IFBITJMPREF(10, [
                            DROP(),
                            DROP(),
                            PUSHINT(1),
                        ])
                    ]],
                ]),
            ),
            DICTIGETJMPZ(),
            THROWARG(11),
        ],
        prepareData: emptyData,
        compareResult: (res: TupleReader) => {
            const num = res.readBigNumber()
            expect(Number(num)).toEqual(999)
        },
    },

    {
        name: "execute",
        methodId: 0,
        instructions: [
            SETCP(0),
            PUSHDICTCONST(
                new Map([
                    // prettier-ignore
                    [0, [
                        execute(someFunction, PUSHINT(1), PUSHINT(2), PUSHINT(3))
                    ]],
                ]),
            ),
            DICTIGETJMPZ(),
            THROWARG(11),
        ],
        prepareData: emptyData,
        compareResult: (res: TupleReader) => {
            const num = res.readBigNumber()
            expect(Number(num)).toEqual(7)
        },
    },

    {
        name: "simple counter",
        methodId: 65536,
        instructions: [
            i.SETCP(0),
            i.PUSHDICTCONST(
                new Map([
                    [
                        0,
                        [
                            i.POP(0),
                            i.SWAP(),
                            i.CTOS(),
                            i.PUSHINT(2),
                            i.SDSKIPFIRST(),
                            i.LDI(1),
                            i.LDI(1),
                            i.LDMSGADDR(),
                            i.PUSH(1),
                            i.XCHG_1([3, 4]),
                            i.XCHG2(6, 6),
                            i.TUPLE(4),
                            i.SETGLOB(1),
                            i.XCHG_0(2),
                            i.SETGLOB(2),
                            i.PUSHCTR(4),
                            i.CTOS(),
                            i.LDI(1),
                            i.SWAP(),
                            i.PUSHCONT_SHORT([i.LDU(32), i.LDU(32), i.ROTREV(), i.BLKDROP2(1, 2)]),
                            i.PUSHCONT_SHORT([
                                i.PUSHINT_16(257),
                                i.LDIX(),
                                i.SWAP(),
                                i.SWAP(),
                                i.ENDS(),
                                i.PUSHINT(0),
                            ]),
                            i.IFELSE(),
                            i.XCHG_0(3),
                            i.PUSHCONT_SHORT([i.BLKDROP(3)]),
                            i.IFJMP(),
                            i.PUSHINT(0),
                            i.PUSH(2),
                            i.SBITS(),
                            i.PUSH(0),
                            i.GTINT(31),
                            i.PUSHCONT_SHORT([i.POP(1), i.XCHG_0(2), i.LDU(32), i.XCHG_0(3)]),
                            i.IF(),
                            i.PUSH(1),
                            i.PUSHINT_LONG(2335447074n),
                            i.EQUAL(),
                            i.PUSHCONT([
                                i.DROP2(),
                                i.SWAP(),
                                i.LDU(64),
                                i.LDU(32),
                                i.ROTREV(),
                                i.BLKDROP2(2, 1),
                                i.XCHG_1([1, 2]),
                                i.ADD(),
                                i.NEWC(),
                                i.PUSHINT(-1),
                                i.SWAP(),
                                i.STI(1),
                                i.ROTREV(),
                                i.XCHG_0(2),
                                i.STU(32),
                                i.STU(32),
                                i.ENDC(),
                                i.POPCTR(4),
                            ]),
                            i.IFJMP(),
                            i.POP(3),
                            i.EQINT(0),
                            i.XCHG_0(2),
                            i.LESSINT(33),
                            i.XCHG_1([1, 2]),
                            i.AND(),
                            i.IFJMPREF([
                                i.SWAP(),
                                i.NEWC(),
                                i.PUSHINT(-1),
                                i.SWAP(),
                                i.STI(1),
                                i.ROTREV(),
                                i.XCHG_0(2),
                                i.STU(32),
                                i.STU(32),
                                i.ENDC(),
                                i.POPCTR(4),
                            ]),
                            i.DROP2(),
                            i.THROW(130),
                        ],
                    ],
                    [
                        65536,
                        [
                            i.PUSHCTR(4),
                            i.CTOS(),
                            i.LDI(1),
                            i.SWAP(),
                            i.PUSHCONT_SHORT([i.LDU(32), i.LDU(32), i.ROTREV(), i.BLKDROP2(1, 2)]),
                            i.PUSHCONT_SHORT([
                                i.PUSHINT_16(257),
                                i.LDIX(),
                                i.SWAP(),
                                i.SWAP(),
                                i.ENDS(),
                                i.PUSHINT(0),
                            ]),
                            i.IFELSE(),
                            i.CALLREF([i.PUSH(0)]),
                            i.BLKDROP2(2, 1),
                        ],
                    ],
                    [
                        105872,
                        [
                            i.PUSHCTR(4),
                            i.CTOS(),
                            i.LDI(1),
                            i.SWAP(),
                            i.PUSHCONT_SHORT([i.LDU(32), i.LDU(32), i.ROTREV(), i.BLKDROP2(1, 2)]),
                            i.PUSHCONT_SHORT([
                                i.PUSHINT_16(257),
                                i.LDIX(),
                                i.SWAP(),
                                i.SWAP(),
                                i.ENDS(),
                                i.PUSHINT(0),
                            ]),
                            i.IFELSE(),
                            i.CALLREF([i.PUSH(1)]),
                            i.BLKDROP2(2, 1),
                        ],
                    ],
                ]),
            ),
            i.DICTIGETJMPZ(),
            i.THROWARG(11),
        ],
        prepareData: () =>
            beginCell().storeUint(1, 1).storeInt(123, 32).storeInt(456, 32).endCell(),
        compareResult: (res: TupleReader) => {
            const num = res.readBigNumber()
            expect(Number(num)).toEqual(456)
        },
    },
]

describe("tests", () => {
    TESTS.forEach(({name, methodId, instructions, prepareData, compareResult}: TestCase) => {
        it(`Test ${name}`, async () => {
            const blockchain: Blockchain = await Blockchain.create()
            blockchain.verbosity.vmLogs = "vm_logs_verbose"
            const treasure: SandboxContract<TreasuryContract> = await blockchain.treasury(name)

            const init: StateInit = {
                code: compileCell(instructions),
                data: prepareData(),
            }

            const address = contractAddress(0, init)
            const contract = new TestContract(address, init)

            const openContract = blockchain.openContract(contract)

            // Deploy
            await openContract.send(
                treasure.getSender(),
                {
                    value: toNano("10"),
                },
                new Cell(),
            )

            const data = await openContract.getAny(methodId)
            compareResult(data)
        })
    })
})

export class TestContract implements Contract {
    readonly address: Address
    readonly init?: StateInit

    constructor(address: Address, init?: StateInit) {
        this.address = address
        this.init = init
    }

    async send(
        provider: ContractProvider,
        via: Sender,
        args: {value: bigint; bounce?: boolean | null | undefined},
        body: Cell,
    ) {
        await provider.internal(via, {...args, body: body})
    }

    async getAny(provider: ContractProvider, id: number): Promise<TupleReader> {
        const builder = new TupleBuilder()
        return (await provider.get(id as any, builder.build())).stack
    }
}
