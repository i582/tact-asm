import {
    Address,
    beginCell, Builder,
    Cell,
    Contract,
    contractAddress,
    ContractProvider, toNano,
    TupleBuilder,
    TupleReader,
} from '@ton/core';
import {compile} from "./instructions";
import {instructions} from "../examples/JettonWallet";
import {AssemblyWriter, disassembleRoot} from "@tact-lang/opcode";
import {Blockchain, SandboxContract, TreasuryContract} from "@ton/sandbox";

async function Foo_init() {
    const boc = compile(instructions)

    // console.log(boc.toString("hex"));

    // console.log(res)

    // const boc = compile([
    //     SETCP0(),
    //     PUSHDICTCONST(new Map([
    //         [0, [
    //             NEWC(),
    //             STSLICECONST(beginCell().storeInt(99, 32).asSlice()),
    //             ENDC(),
    //
    //             CTOS(),
    //             // LDREF(),
    //             // SWAP(),
    //             // CTOS(),
    //             LDI(33),
    //             // DROP(),
    //             // BLKDROP2([5, 1]),
    //
    //             // i.MUL(),
    //         ]],
    //         [100194, [
    //             NEWC(),
    //             STSLICECONST(beginCell().storeInt(99, 32).asSlice()),
    //             ENDC(),
    //
    //             CTOS(),
    //             // LDREF(),
    //             // SWAP(),
    //             // CTOS(),
    //             LDI(33),
    //             // DROP(),
    //             // BLKDROP2([5, 1]),
    //
    //             // // PUSHINT4(10n),
    //             // PUSHINT4(5),
    //             // i.NEWC(),
    //             // i.STU(8),
    //             // i.ENDC(),
    //             // i.CTOS(),
    //             // i.LDU(8),
    //             // // PUSHINT4(8n),
    //             // // i.STIX(),
    //             // // PUSHINT4(5),
    //             // // PUSHINT4(1),
    //             // // PUSHINT4(3),
    //             // // ADD_INT(10),
    //             // // ADD(),
    //             // // i.MUL(),
    //         ]]
    //     ])),
    //     DICTIGETJMPZ(),
    // ])

    const __code = Cell.fromBase64(boc.toString("base64"));
    const builder = beginCell();
    // builder.storeUint(0, 1);
    // builder.storeUint(999, 257);
    builder.storeVarUint(10, 4);
    builder.storeAddress(Address.parse("EQDYqeLV3PStav522hdDLzzzG-By4f3YlJCPXZdfejwxOXdY"));
    builder.storeAddress(Address.parse("EQDYqeLV3PStav522hdDLzzzG-By4f3YlJCPXZdfejwxOXdY"));

    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export class Foo implements Contract {
    static async fromInit() {
        const init = await Foo_init();
        const address = contractAddress(0, init);
        return new Foo(address, init);
    }

    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };

    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async getData(provider: ContractProvider) {
        const builder = new TupleBuilder();
        // 105872
        // 97026 - jetton
        const source = (await provider.get(97026 as any, builder.build())).stack;
        return source.readBigNumber();
    }

    async getGetWalletData(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get(97026 as any, builder.build())).stack;
        return loadGetterTupleJettonWalletData(source);
    }
}

function loadGetterTupleJettonWalletData(source: TupleReader) {
    const _balance = source.readBigNumber();
    const _owner = source.readAddress();
    const _master = source.readAddress();
    const _code = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, code: _code };
}

async function main() {
    const res = compile(instructions)
    console.log(res.toString("hex"))

    const blockchain: Blockchain = await Blockchain.create();
    blockchain.verbosity.vmLogs = "vm_logs"

    const treasure: SandboxContract<TreasuryContract> = await blockchain.treasury("benchmarks");

    const initFoo = await Foo.fromInit();
    const functions = blockchain.openContract(initFoo);

    const init = initFoo.init!;

    const address = contractAddress(0, init);

    // await treasure.send({
    //     to: address,
    //     value: toNano("0.1"),
    //     init,
    //     body: beginCell().endCell(),
    //     sendMode: 1,
    // })

    const provider = blockchain.provider(address, init);
    const openedContract = provider.open(functions)

    const sendRes = await provider.internal(
        treasure.getSender(),
        {
            value: toNano("0.1"),
            body: beginCell().endCell(),
        }
    );
    console.log(sendRes)

    // const b = beginCell()
    // storeJettonBurn({
    //     $$type: "JettonBurn",
    //     queryId: 1n,
    //     amount: 10n,
    //     customPayload: null,
    //     responseDestination: Address.parse("EQDYqeLV3PStav522hdDLzzzG-By4f3YlJCPXZdfejwxOXdY"),
    // })(b)
    //
    // await treasure.send({
    //     to: address,
    //     value: toNano("0.1"),
    //     body: b.endCell(),
    //     sendMode: 1,
    // })

    // console.log(await functions.getData())
    const data = await functions.getGetWalletData();
    console.log(data)
    console.log(AssemblyWriter.write(disassembleRoot(data.code, {
        computeRefs: true,
    }), {}))
}

void main()

export type JettonBurn = {
    $$type: 'JettonBurn';
    queryId: bigint;
    amount: bigint;
    responseDestination: Address;
    customPayload: Cell | null;
}

export function storeJettonBurn(src: JettonBurn) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1499400124, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
    };
}
