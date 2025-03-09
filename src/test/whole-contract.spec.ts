import * as i from "../instructions"
import {compileCell} from "../instructions"
import {
    address,
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
import * as fs from "node:fs"
import {instructions as jettonMinterInstructions} from "./testdata/jetton_minter_discoverable_JettonMinter.tasm"
import {instructions as simpleCounterInstructions} from "./testdata/test_SimpleCounter.tasm"

describe("whole-contract-tests", () => {
    it(`Test simple counter`, async () => {
        const blockchain: Blockchain = await Blockchain.create()
        // blockchain.verbosity.vmLogs = "vm_logs_verbose"
        const treasure: SandboxContract<TreasuryContract> = await blockchain.treasury("treasure")

        const init: StateInit = {
            code: compileCell(simpleCounterInstructions),
            data: beginCell().storeUint(1, 1).storeInt(123, 32).storeInt(456, 32).endCell(),
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

        // send an Add message
        await openContract.send(
            treasure.getSender(),
            {
                value: toNano("10"),
            },
            beginCell()
                .storeUint(2335447074, 32)
                .storeUint(1, 64) // queryId
                .storeUint(100, 32) // amount
                .endCell(),
        )

        const data = await openContract.getAny(65536)
        const num = data.readBigNumber()
        expect(Number(num)).toEqual(556)
    })

    it(`Test Jetton Wallet`, async () => {
        const blockchain: Blockchain = await Blockchain.create()
        // blockchain.verbosity.vmLogs = "vm_logs_verbose"
        const treasure: SandboxContract<TreasuryContract> = await blockchain.treasury("treasure")

        const code = compileCell(jettonMinterInstructions)
        const boc = code.toBoc()
        console.log(code)
        fs.writeFileSync(`${__dirname}/out.boc`, boc)
        return

        const init: StateInit = {
            code: code,

            // balance: Int as coins,
            //     owner: Address,
            //     master: Address,
            // data: beginCell().storeUint(1, 1).storeInt(123, 32).storeInt(456, 32).endCell(),
            data: beginCell()
                .storeVarInt(0, 16)
                .storeAddress(address("Ef9KEg3X-pNUa8F8OpXU6udobGCbERpEf2_U5MI53YyiFlip"))
                .storeAddress(address("Ef9KEg3X-pNUa8F8OpXU6udobGCbERpEf2_U5MI53YyiFlip"))
                .endCell(),
        }

        const address1 = contractAddress(0, init)
        const contract = new TestContract(address1, init)

        const openContract = blockchain.openContract(contract)

        // Deploy
        await openContract.send(
            treasure.getSender(),
            {
                value: toNano("10"),
            },
            beginCell()
                .storeVarInt(0, 16)
                .storeAddress(address("Ef9KEg3X-pNUa8F8OpXU6udobGCbERpEf2_U5MI53YyiFlip"))
                .storeAddress(address("Ef9KEg3X-pNUa8F8OpXU6udobGCbERpEf2_U5MI53YyiFlip"))
                .endCell(),
        )

        // // send an Add message
        // await openContract.send( treasure.getSender(), {
        //     value: toNano("10"),
        // }, beginCell()
        //     .storeUint(2335447074, 32)
        //     .storeUint(1, 64) // queryId
        //     .storeUint(100, 32) // amount
        //     .endCell()
        // )

        const res = await openContract.getGetWalletData()
        console.log(res.balance)
        console.log(res.owner)

        // const data = await openContract.getAny(65536)
        // const num = data.readBigNumber()
        // expect(Number(num)).toEqual(556)
    })
})

function loadGetterTupleJettonWalletData(source: TupleReader) {
    const _balance = source.readBigNumber()
    const _owner = source.readCell()
    const _master = source.readCell()
    const _code = source.readCell()
    return {
        $$type: "JettonWalletData" as const,
        balance: _balance,
        owner: _owner,
        master: _master,
        code: _code,
    }
}

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

    async getGetWalletData(provider: ContractProvider) {
        const builder = new TupleBuilder()
        const source = (await provider.get(97026 as any, builder.build())).stack
        const result = loadGetterTupleJettonWalletData(source)
        return result
    }
}
