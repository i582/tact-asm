import {
    compileCell,
    DICTIGETJMPZ,
    DROP,
    IFBITJMPREF,
    IFNBITJMPREF,
    Instr,
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
    SenderArguments,
    StateInit,
    toNano,
    TupleBuilder,
    TupleReader,
} from "@ton/core"
import {Blockchain, SandboxContract, TreasuryContract} from "@ton/sandbox"
import {Maybe} from "@ton/core/dist/utils/maybe"

interface TestCase {
    readonly name: string
    readonly instructions: Instr[]
    readonly prepareData: () => Maybe<Cell>
    readonly compareResult: (res: TupleReader) => void
}

const emptyData = () => beginCell().endCell()

const TESTS: TestCase[] = [
    {
        name: "IFBITJMPREF true",
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
]

describe("tests", () => {
    TESTS.forEach(({name, instructions, prepareData, compareResult}: TestCase) => {
        it(`Test ${name}`, async () => {
            const blockchain: Blockchain = await Blockchain.create()
            // blockchain.verbosity.vmLogs = "vm_logs_verbose"
            const treasure: SandboxContract<TreasuryContract> = await blockchain.treasury(name)

            const init: StateInit = {
                code: compileCell(instructions),
                data: prepareData(),
            }

            const address = contractAddress(0, init)
            const contract = new TestContract(address, init)

            const openContract = blockchain.openContract(contract)

            // Deploy
            await treasure.send({
                to: openContract.address,
                value: toNano("0.1"),
                body: beginCell().endCell(),
                init,
            } satisfies SenderArguments)

            const data = await openContract.getAny(0)
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

    async getAny(provider: ContractProvider, id: number): Promise<TupleReader> {
        const builder = new TupleBuilder()
        return (await provider.get(id as any, builder.build())).stack
    }
}
