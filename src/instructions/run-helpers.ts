import {compile, compileCell, Instr} from "./instr"
import {
    Address,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    StateInit,
    toNano,
    TupleBuilder,
    TupleReader,
} from "@ton/core"
import {Cell} from "opcode"
import {Blockchain, SandboxContract, TreasuryContract} from "@ton/sandbox"
import {DICTIGETJMPZ, SETCP, SWAP, THROWARG} from "./instr.gen"
import {PUSHDICTCONST} from "./complex-instructions"
import {measureGas2} from "./helpers"

export const measureGas = async (code: Instr[]): Promise<number> => {
    class TestContract implements Contract {
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

    const blockchain: Blockchain = await Blockchain.create()
    // blockchain.verbosity.vmLogs = "vm_logs"
    const treasure: SandboxContract<TreasuryContract> = await blockchain.treasury("treasure")

    const instructions = [
        SETCP(0),
        PUSHDICTCONST(
            19,
            new Map([
                // prettier-ignore
                [0, [
                    measureGas2(code),
                    SWAP(),
                ]],
            ]),
        ),
        DICTIGETJMPZ(),
        THROWARG(11),
    ]

    const init: StateInit = {
        code: compileCell(instructions),
        data: new Cell(),
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

    const data = await openContract.getAny(0)
    return data.readNumber()
}

export const measureSize = (code: Instr[]): number => {
    return compile(code).length * 8
}
