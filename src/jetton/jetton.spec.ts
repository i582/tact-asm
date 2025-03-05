import "@ton/test-utils";
import {
    Address,
    beginCell,
    Builder,
    Cell,
    contractAddress,
    SendMode,
    toNano,
} from "@ton/core";
import type { SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Blockchain } from "@ton/sandbox";

import {
    type Mint,
    type ProvideWalletAddress,
    JettonMinter,
    storeJettonBurn,
    storeJettonTransfer,
    storeMint,
} from "./jetton_minter_discoverable_JettonMinter";

import "@ton/test-utils";
import {
    JettonBurn,
    JettonTransfer,
    JettonUpdateContent, storeProvideWalletAddress,
} from "./jetton_wallet_JettonWallet";

import { join, resolve } from "path";

const sendDiscoveryRaw = async (
    minterAddress: Address,
    via: SandboxContract<TreasuryContract>,
    address: Address,
    includeAddress: boolean,
    value: bigint,
) => {
    const msg: ProvideWalletAddress = {
        $$type: "ProvideWalletAddress",
        queryId: 0n,
        ownerAddress: address,
        includeAddress: includeAddress,
    };

    const msgCell = beginCell().store(storeProvideWalletAddress(msg)).endCell();

    return await via.send({
        to: minterAddress,
        value,
        body: msgCell,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
    });
};

const sendTransferRaw = async (
    jettonWalletAddress: Address,
    via: SandboxContract<TreasuryContract>,
    value: bigint,
    jetton_amount: bigint,
    to: Address,
    responseAddress: Address,
    customPayload: Cell | null,
    forward_ton_amount: bigint,
    forwardPayload: Cell | null,
) => {
    const parsedForwardPayload =
        forwardPayload != null
            ? forwardPayload.beginParse()
            : new Builder().storeUint(0, 1).endCell().beginParse(); //Either bit equals 0

    const msg: JettonTransfer = {
        $$type: "JettonTransfer",
        queryId: 0n,
        amount: jetton_amount,
        destination: to,
        responseDestination: responseAddress,
        customPayload: customPayload,
        forwardTonAmount: forward_ton_amount,
        forwardPayload: parsedForwardPayload,
    };

    const msgCell = beginCell().store(storeJettonTransfer(msg)).endCell();

    return await via.send({
        to: jettonWalletAddress,
        value,
        body: msgCell,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
    });
};

const sendMintRaw = async (
    jettonMinterAddress: Address,
    via: SandboxContract<TreasuryContract>,
    to: Address,
    jetton_amount: bigint,
    forward_ton_amount: bigint,
    total_ton_amount: bigint,
) => {
    if (total_ton_amount <= forward_ton_amount) {
        throw new Error(
            "Total TON amount should be greater than the forward amount",
        );
    }

    const msg: Mint = {
        $$type: "Mint",
        queryId: 0n,
        receiver: to,
        tonAmount: total_ton_amount,
        mintMessage: {
            $$type: "JettonTransferInternal",
            queryId: 0n,
            amount: jetton_amount,
            responseDestination: jettonMinterAddress,
            forwardTonAmount: forward_ton_amount,
            sender: jettonMinterAddress,
            forwardPayload: beginCell().storeUint(0, 1).endCell().beginParse(),
        },
    };

    const msgCell = beginCell().store(storeMint(msg)).endCell();

    return await via.send({
        to: jettonMinterAddress,
        value: total_ton_amount + toNano("0.015"),
        body: msgCell,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
    });
};

const sendBurnRaw = async (
    jettonWalletAddress: Address,
    via: SandboxContract<TreasuryContract>,
    value: bigint,
    jetton_amount: bigint,
    responseAddress: Address,
    customPayload: Cell | null,
) => {
    const msg: JettonBurn = {
        $$type: "JettonBurn",
        queryId: 0n,
        amount: jetton_amount,
        responseDestination: responseAddress,
        customPayload: customPayload,
    };

    const msgCell = beginCell().store(storeJettonBurn(msg)).endCell();

    return await via.send({
        to: jettonWalletAddress,
        value,
        body: msgCell,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
    });
};

const getJettonWalletRaw = async (
    minterAddress: Address,
    blockchain: Blockchain,
    walletAddress: Address,
) => {
    const walletAddressResult = await blockchain
        .provider(minterAddress)
        .get(`get_wallet_address`, [
            {
                type: "slice",
                cell: beginCell().storeAddress(walletAddress).endCell(),
            },
        ]);

    return walletAddressResult.stack.readAddress();
};

describe("Jetton", () => {
    let blockchain: Blockchain;
    let jettonMinter: SandboxContract<JettonMinter>;
    let jettonMinterFuncAddress: Address;
    let jettonMinterNotcoinAddress: Address;
    let deployer: SandboxContract<TreasuryContract>;

    let defaultContent: Cell;

    beforeAll(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury("deployer");

        defaultContent = beginCell().endCell();
        const msg: JettonUpdateContent = {
            $$type: "JettonUpdateContent",
            queryId: 0n,
            content: new Cell(),
        };

        jettonMinter = blockchain.openContract(
            await JettonMinter.fromInit(0n, deployer.address, defaultContent),
        );
        const deployResult = await jettonMinter.send(
            deployer.getSender(),
            { value: toNano("0.1") },
            msg,
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            deploy: true,
            success: true,
        });
    });

    it("transfer", async () => {
        const runMintTest = async (minterAddress: Address) => {
            const mintResult = await sendMintRaw(
                minterAddress,
                deployer,
                deployer.address,
                toNano(100000),
                toNano("0.05"),
                toNano("1"),
            )

            const deployerJettonWalletAddress = await getJettonWalletRaw(
                minterAddress,
                blockchain,
                deployer.address,
            );

            expect(mintResult.transactions).toHaveTransaction({
                from: minterAddress,
                to: deployerJettonWalletAddress,
                success: true,
                endStatus: "active",
            });

            const someAddress = Address.parse(
                "EQD__________________________________________0vo",
            );

            const sendResult = await sendTransferRaw(
                deployerJettonWalletAddress,
                deployer,
                toNano(1),
                1n,
                someAddress,
                deployer.address,
                null,
                0n,
                null,
            )

            expect(sendResult.transactions).not.toHaveTransaction({
                success: false,
            });

            expect(sendResult.transactions).toHaveTransaction({
                from: deployerJettonWalletAddress,
                success: true,
                exitCode: 0,
            });

            return 0
        };

        const transferGasUsedTact = await runMintTest(jettonMinter.address);
        expect(transferGasUsedTact).toBe(0)
    });
});
