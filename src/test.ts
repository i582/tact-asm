import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
} from "@ton/sandbox";
import {Foo} from "./test_Foo";
import {Address, beginCell, Builder, Cell, contractAddress, toNano} from "@ton/core";
import {instructions} from "./test_Jetton";
import {compile} from "./instr";
import {AssemblyWriter, disassembleRoot} from "@tact-lang/opcode";

// b5ee9c72 4102250 1000 44600010 eff00 f4a413f4bc0102016202240106d0308803026c01d072d721d200d200fa4021103450666f04f86102f862ed44d0fa00fa40fa4055206c1306e30202d70d1ff2e0822182100f8a7ea5880408034a028020d7217021d749c21f8e80de208210178d4519ba8e80e082107bdd97deba8e80e05f04050607000830d31f01003230d33ffa00596c21a002c855205afa0258cf1601cf16c9ed540030d33ffa00596c21a002c855205afa0258cf1601cf16c9ed54032cbae302218210178d4519bae302018210595f07bcba88090f1e032e31d33ffa00fa4020d70b01c3008e808e80e201d200018810110a03ce8e808e80e2fa0051661016101510144330323622fa4430c000f2e14df8425280c705f2e2c15163a120c2fff2e2c226d749c200f2e2c4f8416f2429a471b044305244fa40fa0071d721fa00fa00306c6170f83aa85270a0820a625a00a0bcf2e2c550437080408820210b03f87f2a4813509ac855508210178d45195007cb1f1015cb3f5003fa0201cf1601206e8e808e80e201fa0201cf16c9525228f82ac855215afa0258cf1601cf16c9105610361045102410235f41f90001f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f9040003c8cf8580ca001012cccccf884008cbff01880c0d0e000a307001cb010004cf16003efa028069cf40cf8634f400c901fb0002c855205afa0258cf1601cf16c9ed54032631d33ffa00fa4020d70b01c3008e808e80e2881011120006fa4001000872d7216d02c201fa005155101510144330365163a0705339f82ac855215afa0258cf1601cf16c9f842fa44315920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f9040001bab38e80def8416f2421f8276f1021a1820898968066b608a18813140010f84229c705f2e2c303208208e4e1c0a0a12bc2008e808e80e28815161700b65530fa40fa0071d721fa00fa00306c6170f83a5280a0a171702747135069c8553082107362d09c5005cb1f1013cb3f01fa0201cf1601cf16c9280610384500441359c8cf8580ca00cf8440ce01fa02806acf40f400c901fb001023000c3b5f043334300312226eb38e808e80e28818191a000623c200000270030c8e80e30d02881b1c1d00046c31005e727003c8018210d53276db58cb1fcb3fc910354150441359c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00001ec855205afa0258cf1601cf16c9ed54010ee3025f04f2c0821f03d6d33ffa00fa40d200018e808e80e255303033f8425250c705f2e2c15133a120c2fff2e2c2f8416f2443305230fa40fa0071d721fa00fa00306c6170f83a8209c9c380a0bcf2e2c37080405413567f06c8553082107bdd97de5005cb1f1013cb3f01fa0201cf1601cf16c9882021220002d400046d01012c264544441359c8cf8580ca00cf8440ce01fa02806a88230030cf40f400c901fb0002c855205afa0258cf1601cf16c9ed540031a0f605da89a1f401f481f480aa40d827f054a8c660a460d869b0a62e0e
// b5ee9c72 01020e0 1000 3e700021 eff00 208e8130e1f4a413f4bcf2c80b0102049401d072d721d200d200fa4021103450666f04f86102f862ed44d0fa00fa40fa4055206c1304e30202d70d1ff2e0822182100f8a7ea5bae302218210178d4519bae302018210595f07bcba030405060033a65ec0bb51343e803e903e9015481b04fe0a9518cc148c1b0d2000b2028020d7217021d749c21f9430d31f01de208210178d4519ba8e1930d33ffa00596c21a002c855205afa0258cf1601cf16c9ed54e082107bdd97deba8e18d33ffa00596c21a002c855205afa0258cf1601cf16c9ed54e05f0401fe31d33ffa00fa4020d70b01c30093fa40019472d7216de201d2000191d4926d01e2fa0051661615144330323622fa4430c000f2e14df8425280c705f2e2c15163a120c2fff2e2c226d749c200f2e2c4f8416f2429a471b044305244fa40fa0071d721fa00fa00306c6170f83aa85270a0820a625a00a0bcf2e2c550437080400701f831d33ffa00fa4020d70b01c30093fa40019472d7216de201fa00515515144330365163a0705339f82ac855215afa0258cf1601cf16c9f842fa44315920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f9040001bab398f84229c705f2e2c3def8416f2421f8276f1021a1820898968066b608a109010ee3025f04f2c0820c01fc7f2a4813509ac855508210178d45195007cb1f15cb3f5003fa0201cf1601206e95307001cb0192cf16e201fa0201cf16c9525228f82ac855215afa0258cf1601cf16c9105610361045102410235f41f90001f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f9040003c8cf8580ca0012cccccf884008cbff0108003efa028069cf40cf8634f400c901fb0002c855205afa0258cf1601cf16c9ed5402fc8208e4e1c0a0a12bc2008e5a5530fa40fa0071d721fa00fa00306c6170f83a5280a0a171702747135069c8553082107362d09c5005cb1f13cb3f01fa0201cf1601cf16c9280410384500441359c8cf8580ca00cf8440ce01fa02806acf40f400c901fb001023963b5f04333430e2226eb39323c2009170e2926c31e30d020a0b005e727003c8018210d53276db58cb1fcb3fc910354150441359c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00001ec855205afa0258cf1601cf16c9ed5401fed33ffa00fa40d2000191d4926d01e255303033f8425250c705f2e2c15133a120c2fff2e2c2f8416f2443305230fa40fa0071d721fa00fa00306c6170f83a8209c9c380a0bcf2e2c37080405413567f06c8553082107bdd97de5005cb1f13cb3f01fa0201cf1601cf16c9264544441359c8cf8580ca00cf8440ce01fa02806a0d0030cf40f400c901fb0002c855205afa0258cf1601cf16c9ed54

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
    console.log(AssemblyWriter.write(disassembleRoot(data.code, {}), {}))
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
