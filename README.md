# tact-asm

# TODO

## Dictionary snapshit

Solutions:

1. Check compiled hex with original one and insert `i.DICTPUSHCONST(<hex>)` instead of `i.PUSHDICTCONST(19, new Map([]))`
2. Generate low level representation of Hashmap (see TL-B in block.tlb)

Code:

```
i.SETCP(0),
i.PUSHDICTCONST(19, new Map([
    [0, [
        i.POP(0),
    ]],
    [121630, [
        i.PUSH(1),
        i.MUL(),
    ]],
])),
i.DICTIGETJMPZ(),
i.THROWARG(11),
```

Original HEX: `b5ee9c72010104010020000114ff00f4a413f4bcf2c80b010203844002030007a00000610009a1b63c4351`
