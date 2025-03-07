import {compileFunc} from "@ton-community/func-js"

compileFunc({
    sources: [
        {
            content: `
            builder begin_cell() asm "NEWC";
            ;; builder store_slice1(builder b) asm "b{0} STSLICECONST";
            ;; builder store_slice2(builder b) asm "b{00} STSLICECONST";
            ;; builder store_slice3(builder b) asm "b{000} STSLICECONST";
            ;; builder store_slice4(builder b) asm "b{0000} STSLICECONST";
            ;; builder store_slice5(builder b) asm "b{00000} STSLICECONST";
            ;; builder store_slice6(builder b) asm "b{000000} STSLICECONST";
            ;; builder store_slice7(builder b) asm "b{0000000} STSLICECONST";
            ;; builder store_slice8(builder b) asm "b{00000000} STSLICECONST";
            builder store_slice9(builder b) asm "x{6_} STSLICECONST";
            int builder_bits(builder b) asm "BBITS";
            
            ;; () foo() impure {
            ;;     begin_cell().store_slice();
            ;; }
            
            () recv_internal() impure {
                throw(begin_cell()
                    ;; .store_slice1()
                    ;; .store_slice2()
                    ;; .store_slice3()
                    ;; .store_slice4()
                    ;; .store_slice5()
                    ;; .store_slice6()
                    ;; .store_slice7()
                    ;; .store_slice8()
                    .store_slice9()
                    .builder_bits());
            }
            
            `,
            filename: "source",
        },
    ],
}).then(it => {
    if (it.status === "ok") {
        console.log(it.codeBoc)
        console.log(Buffer.from(it.codeBoc, "base64").toString("hex"))
    }
})
