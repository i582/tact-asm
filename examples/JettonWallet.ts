import * as i from "../src/instructions";
import {beginCell, BitString} from "@ton/core";
import {Hash} from "../src/instructions/asm1";

export const instructions = [
  i.SETCP(0),
  i.PUSHDICTCONST(new Map([
    [0, [
      i.POP(0),                                   // 0x3 0
      i.PUSHREF([
        i.SWAP(),                                 // 0x0 1
        i.CTOS(),                                 // 0xD0
        i.PUSHINT(2),                             // 0x7 2
        i.SDSKIPFIRST(),                          // 0xD721
        i.LDI(1),                                 // 0xD2 00
        i.LDI(1),                                 // 0xD2 00
        i.LDMSGADDR(),                            // 0xFA40
        i.PUSH(1),                                // 0x2 1
        i.XCHG_1([3, 4]),                         // 0x10 3 4
        i.XCHG2(6 , 6),                           // 0x50 6 6
        i.TUPLE(4),                               // 0x6F0 4
        i.SETGLOB(1),                             // 0xF87_ 0C_
        i.XCHG_0(2),                              // 0x0 2
        i.SETGLOB(2),                             // 0xF87_ 14_
        i.PUSHCTR(4),                             // 0xED4 4
        i.CTOS(),                                 // 0xD0
        i.LDGRAMS(),                              // 0xFA00
        i.LDMSGADDR(),                            // 0xFA40
        i.LDMSGADDR(),                            // 0xFA40
        i.BLKSWAP(3 , 1),                         // 0x55 2 0
        i.BLKDROP2([1 , 3]),                      // 0x6C 1 3
        i.XCHG_0(4),                              // 0x0 4
        i.IFJMPREF([
          i.XCHG_0(2),                            // 0x0 2
          i.PUSHINT_8(32),                        // 0x80 20
          i.SDSKIPFIRST(),                        // 0xD721
          i.PUSHINT(0),                           // 0x7 0
          i.PUSH(1),                              // 0x2 1
          i.SBITS(),                              // 0xD749
          i.GTINT(31),                            // 0xC2 1F
          i.PUSHCONT([
            i.POP(0),                             // 0x3 0
            i.LDU(32),                            // 0xD3 1F
            i.SWAP(),                             // 0x0 1
          ]),                                     // 0x9 30D31F01
          i.IF(),                                 // 0xDE
          i.PUSH(0),                              // 0x2 0
          i.PUSHINT_LONG(395134233n),                 // 0x82 10178D4519
          i.EQUAL(),                              // 0xBA
          i.PUSHCONT([
            i.POP(0),                             // 0x3 0
            i.LDU(64),                            // 0xD3 3F
            i.LDGRAMS(),                          // 0xFA00
            i.ROTREV(),                           // 0x59
            i.BLKDROP2([2 , 1]),                  // 0x6C 2 1
            i.ADD(),                              // 0xA0
            i.XCHG_0(2),                          // 0x0 2
            i.NEWC(),                             // 0xC8
            i.BLKSWAP(3 , 1),                     // 0x55 2 0
            i.SWAP2(),                            // 0x5A
            i.STGRAMS(),                          // 0xFA02
            i.ROT(),                              // 0x58
            i.STSLICER(),                         // 0xCF16
            i.SWAP(),                             // 0x0 1
            i.STSLICER(),                         // 0xCF16
            i.ENDC(),                             // 0xC9
            i.POPCTR(4),                          // 0xED5 4
          ]),                                     // 0x8F_ 30D33FFA00596C21A002C855205AFA0258CF1601CF16C9ED54
          i.IFJMP(),                              // 0xE0
          i.PUSHINT_LONG(2078119902n),            // 0x82 107BDD97DE
          i.EQUAL(),                              // 0xBA
          i.PUSHCONT([
            i.LDU(64),                            // 0xD3 3F
            i.LDGRAMS(),                          // 0xFA00
            i.ROTREV(),                           // 0x59
            i.BLKDROP2([2 , 1]),                  // 0x6C 2 1
            i.ADD(),                              // 0xA0
            i.XCHG_0(2),                          // 0x0 2
            i.NEWC(),                             // 0xC8
            i.BLKSWAP(3 , 1),                     // 0x55 2 0
            i.SWAP2(),                            // 0x5A
            i.STGRAMS(),                          // 0xFA02
            i.ROT(),                              // 0x58
            i.STSLICER(),                         // 0xCF16
            i.SWAP(),                             // 0x0 1
            i.STSLICER(),                         // 0xCF16
            i.ENDC(),                             // 0xC9
            i.POPCTR(4),                          // 0xED5 4
          ]),                                     // 0x8F_ D33FFA00596C21A002C855205AFA0258CF1601CF16C9ED54
          i.IFJMP(),                              // 0xE0
          i.BLKDROP(4),                           // 0x5F0 4
        ]),                                       // 0xE302 028020D7217021D749C21F9430D31F01DE208210178D4519BA8E1930D33FFA00596C21A002C855205AFA0258CF1601CF16C9ED54E082107BDD97DEBA8E18D33FFA00596C21A002C855205AFA0258CF1601CF16C9ED54E05F04
        i.XCHG_0(2),                              // 0x0 2
        i.LDUQ(32),                               // 0xD70D 1F
        i.THROWIFNOT(130),                        // 0xF2E4_ 105_
        i.PUSH(1),                                // 0x2 1
        i.PUSHINT_LONG(260734629n),                   // 0x82 100F8A7EA5
        i.PUSHREF([
            i.EQUAL(),                                // 0xBA
            i.IFJMPREF([
                i.POP(1),                               // 0x3 1
                i.LDU(64),                              // 0xD3 3F
                i.LDGRAMS(),                            // 0xFA00
                i.LDMSGADDR(),                          // 0xFA40
                i.PUSH(0),                              // 0x2 0
                i.PLDU(2),                              // 0xD70B 01
                i.NEQINT(0),                            // 0xC3 00
                i.PUSHCONT([
                    i.LDMSGADDR(),                        // 0xFA40
                    i.SWAP(),                             // 0x0 1
                ]),                                     // 0x9 FA4001
                i.PUSHCONT([
                    i.PUSHINT(2),                         // 0x7 2
                    i.SDSKIPFIRST(),                      // 0xD721
                    i.PUSHNULL(),                         // 0x6D
                ]),                                     // 0x9 72D7216D
                i.IFELSE(),                             // 0xE2
                i.SWAP(),                               // 0x0 1
                i.LDI(1),                               // 0xD2 00
                i.SWAP(),                               // 0x0 1
                i.PUSHREF([
                    i.PUSHCONT([
                        i.LDREF(),                            // 0xD4
                    ]),                                     // 0x9 D4
                    i.PUSHCONT([
                        i.PUSHNULL(),                         // 0x6D
                        i.SWAP(),                             // 0x0 1
                    ]),                                     // 0x9 6D01
                    i.IFELSE(),                             // 0xE2
                    i.LDGRAMS(),                            // 0xFA00
                    i.XCPU(6 , 6),                          // 0x51 6 6
                    i.XCHG_1([1, 6]),                       // 0x1 6
                    i.XCHG_1([1, 5]),                       // 0x1 5
                    i.XCHG_1([1, 4]),                       // 0x1 4
                    i.XCHG3(3 , 3 , 0),                     // 0x4 3 3 0
                    i.POP(2),                               // 0x3 2
                    i.POP(6),                               // 0x3 6
                    i.PUSH(2),                              // 0x2 2
                    i.REWRITESTDADDR(),                     // 0xFA44
                    i.POP(0),                               // 0x3 0
                    i.EQINT(0),                             // 0xC0 00
                    i.THROWIFNOT(333),                      // 0xF2E4_ 29B_
                    i.GETGLOB(2),                           // 0xF85_ 14_
                    i.PUXC(8 , -1),                         // 0x52 8 0
                    i.SDEQ(),                               // 0xC705
                    i.THROWIFNOT(705),                      // 0xF2E4_ 583_
                    i.XCPU(6 , 3),                          // 0x51 6 3
                    i.SUB(),                                // 0xA1
                    i.PUSH(0),                              // 0x2 0
                    i.GTINT(-1),                            // 0xC2 FF
                    i.THROWIFNOT(706),                      // 0xF2E4_ 585_
                    i.PUSH(6),                              // 0x2 6
                    i.SBITS(),                              // 0xD749
                    i.GTINT(0),                             // 0xC2 00
                    i.THROWIFNOT(708),                      // 0xF2E4_ 589_
                    i.GETGLOB(1),                           // 0xF85_ 0C_
                    i.UNTUPLE(4),                           // 0x6F2 4
                    i.PUSH(9),                              // 0x2 9
                    i.INC(),                                // 0xA4
                    i.PUSHINT(1),                           // 0x7 1
                    i.PUSHREF([
                        i.AND(),                                // 0xB0
                        i.XCHG3(4 , 3 , 0),                     // 0x4 4 3 0
                        i.PUXC(4 , 3),                          // 0x52 4 4
                        i.LDMSGADDR(),                          // 0xFA40
                        i.LDGRAMS(),                            // 0xFA00
                        i.PUSHINT(1),                           // 0x7 1
                        i.SDSKIPFIRST(),                        // 0xD721
                        i.LDGRAMS(),                            // 0xFA00
                        i.LDGRAMS(),                            // 0xFA00
                        i.POP(0),                               // 0x3 0
                        i.BLKDROP2([6 , 1]),                    // 0x6C 6 1
                        i.PUSHINT(0),                           // 0x7 0
                        i.GETORIGINALFWDFEE(),                  // 0xF83A
                        i.MUL(),                                // 0xA8
                        i.PUXC(7 , -1),                         // 0x52 7 0
                        i.ADD(),                                // 0xA0
                        i.PUSHINT_LONG(40000000n),                  // 0x82 0A625A00
                        i.ADD(),                                // 0xA0
                    ]),
                    i.PUSHREF([
                        i.GREATER(),                            // 0xBC
                        i.THROWIFNOT(709),                      // 0xF2E4_ 58B_
                        i.XCHG2(4 , 3),                         // 0x50 4 3
                        i.PUSHINT(0),                           // 0x7 0
                        i.PUSHINT_8(64),                        // 0x80 40
                        i.PUSHINT(-1),                        // 0x7 F
                        i.PUSH(10),                           // 0x2 A
                        i.XCHG3(8 , 1 , 3),                   // 0x4 8 1 3
                        i.XCHG2(9 , 10),                      // 0x50 9 A
                        i.NEWC(),                             // 0xC8
                        i.BLKSWAP(6 , 1),                     // 0x55 5 0
                        i.PUSHINT_LONG(395134233n),               // 0x82 10178D4519
                        i.XCHG2(0 , 7),                       // 0x50 0 7
                        i.STU(32),                            // 0xCB 1F
                        i.XCHG_1([1, 5]),                     // 0x1 5
                        i.STU(64),                            // 0xCB 3F
                        i.XCHG2(0 , 3),                       // 0x50 0 3
                        i.STGRAMS(),                          // 0xFA02
                        i.SWAP(),                             // 0x0 1
                        i.STSLICER(),                         // 0xCF16
                        i.SWAP(),                             // 0x0 1
                        i.PUSH(0),                            // 0x2 0
                        i.ISNULL(),                           // 0x6E
                        i.PUSHCONT([
                            i.POP(0),                           // 0x3 0
                            i.PUSHINT(0),                       // 0x7 0
                            i.SWAP(),                           // 0x0 1
                            i.STU(2),                           // 0xCB 01
                        ]),                                   // 0x9 307001CB01
                        i.PUSHCONT([
                            i.STSLICER(),                       // 0xCF16
                        ]),                                   // 0x9 CF16
                        i.IFELSE(),                           // 0xE2
                        i.SWAP(),                             // 0x0 1
                        i.STGRAMS(),                          // 0xFA02
                        i.SWAP(),                             // 0x0 1
                        i.STSLICER(),                         // 0xCF16
                        i.ENDC(),                             // 0xC9
                        i.PUXC(5 , 1),                        // 0x52 5 2
                        i.PUSH(8),                            // 0x2 8
                        i.GETPARAM(10),                       // 0xF82 A
                        i.PUSHREF([
                            i.NEWC(),                             // 0xC8
                            i.BLKSWAP(3 , 2),                     // 0x55 2 1
                            i.SWAP2(),                            // 0x5A
                            i.STGRAMS(),                          // 0xFA02
                            i.ROT(),                              // 0x58
                            i.STSLICER(),                         // 0xCF16
                            i.SWAP(),                             // 0x0 1
                            i.STSLICER(),                         // 0xCF16
                            i.ENDC(),                             // 0xC9
                            i.XCHG_1([5, 6]),                     // 0x10 5 6
                            i.XCHG_1([3, 6]),                     // 0x10 3 6
                            i.XCHG_1([4, 5]),                     // 0x10 4 5
                            i.XCHG_1([2, 4]),                     // 0x10 2 4
                            i.XCHG_1([2, 3]),                     // 0x10 2 3
                            i.BLKPUSH([4, 1]),                     // 0x5F 4 1
                            i.HASHCU(),                           // 0xF900
                            i.SWAP(),                             // 0x0 1
                            i.HASHCU(),                           // 0xF900
                            i.PUSHREF([
                                i.SWAP2(),                            // 0x5A
                                i.CDEPTH(),                           // 0xD765
                                i.SWAP(),                             // 0x0 1
                                i.CDEPTH(),                           // 0xD765
                                i.PUSHINT_LONG(131380n),                  // 0x82 020134
                                i.NEWC(),                             // 0xC8
                                i.STU(24),                            // 0xCB 17
                                i.STU(16),                            // 0xCB 0F
                                i.STU(16),                            // 0xCB 0F
                                i.STU(256),                           // 0xCB FF
                                i.STU(256),                           // 0xCB FF
                                i.PUSHINT(1),                         // 0x7 1
                                i.HASHEXT(Hash.SHA256),                   // 0xF90400
                                i.XCHG_0(3),                          // 0x0 3
                                i.NEWC(),                             // 0xC8
                                i.STSLICECONST(beginCell().storeBits(new BitString(Buffer.from("40", "hex"), 0, 2)).asSlice()), // 0xCFC0_ 6_
                                i.STI(1),                             // 0xCA 00
                                i.XCHG_1([1, 2]),                     // 0x1 2
                                i.STREF(),                            // 0xCC
                                i.STREF(),                            // 0xCC
                                i.STSLICECONST(beginCell().storeBits(new BitString(Buffer.from("1000", "hex"), 0, 14)).asSlice()), // 0xCFC0_ 1002_
                                i.STU(256),                           // 0xCB FF
                                i.SWAP(),                             // 0x0 1
                            ]),
                        ]),
                        i.PUSHREF([
                            i.STGRAMS(),                        // 0xFA02
                            i.PUSHINT_8(105),                   // 0x80 69
                            i.STZEROES(),                       // 0xCF40
                            i.STSLICECONST(beginCell().storeBits(new BitString(Buffer.from("8c", "hex"), 0, 7)).asSlice()), // 0xCFC0_ 8D_
                            i.STDICT(),                         // 0xF400
                            i.ENDC(),                           // 0xC9
                            i.SWAP(),                           // 0x0 1
                            i.SENDRAWMSG(),                     // 0xFB00
                            i.XCHG_0(2),                        // 0x0 2
                            i.NEWC(),                           // 0xC8
                            i.BLKSWAP(3 , 1),                   // 0x55 2 0
                            i.SWAP2(),                          // 0x5A
                            i.STGRAMS(),                        // 0xFA02
                            i.ROT(),                            // 0x58
                            i.STSLICER(),                       // 0xCF16
                            i.SWAP(),                           // 0x0 1
                            i.STSLICER(),                       // 0xCF16
                            i.ENDC(),                           // 0xC9
                            i.POPCTR(4),                        // 0xED5 4
                        ]),                                   // 0x88
                    ]),                                     // 0x88
                ])
            ]),                                       // 0xE302 31D33FFA00FA4020D70B01C30093FA40019472D7216DE201D2000191D4926D01E2FA0051661615144330323622FA4430C000F2E14DF8425280C705F2E2C15163A120C2FFF2E2C226D749C200F2E2C4F8416F2429A471B044305244FA40FA0071D721FA00FA00306C6170F83AA85270A0820A625A00A0BCF2E2C55043708040
            i.PUSH(1),                                // 0x2 1
            i.PUSHINT_LONG(395134233n),                   // 0x82 10178D4519
            i.EQUAL(),                                // 0xBA
            i.IFJMPREF([
                i.POP(1),                               // 0x3 1
                i.LDU(64),                              // 0xD3 3F
                i.LDGRAMS(),                            // 0xFA00
                i.LDMSGADDR(),                          // 0xFA40
                i.PUSH(0),                              // 0x2 0
                i.PLDU(2),                              // 0xD70B 01
                i.NEQINT(0),                            // 0xC3 00
                i.PUSHCONT([
                    i.LDMSGADDR(),                        // 0xFA40
                    i.SWAP(),                             // 0x0 1
                ]),                                     // 0x9 FA4001
                i.PUSHCONT([
                    i.PUSHINT(2),                         // 0x7 2
                    i.SDSKIPFIRST(),                      // 0xD721
                    i.PUSHNULL(),                         // 0x6D
                ]),                                     // 0x9 72D7216D
                i.IFELSE(),                             // 0xE2
                i.PUSHREF([
                    i.SWAP(),                               // 0x0 1
                    i.LDGRAMS(),                            // 0xFA00
                    i.XCPU(5 , 5),                          // 0x51 5 5
                    i.XCHG_1([1, 5]),                       // 0x1 5
                    i.XCHG_1([1, 4]),                       // 0x1 4
                    i.XCHG3(3 , 3 , 0),                     // 0x4 3 3 0
                    i.POP(6),                               // 0x3 6
                    i.XCPU(6 , 3),                          // 0x51 6 3
                    i.ADD(),                                // 0xA0
                    i.PUSHINT(0),                           // 0x7 0
                    i.PUSH2(3 , 9),                         // 0x53 3 9
                    i.GETPARAM(10),                         // 0xF82 A
                    i.NEWC(),                               // 0xC8
                    i.BLKSWAP(3 , 2),                       // 0x55 2 1
                    i.SWAP2(),                              // 0x5A
                    i.STGRAMS(),                            // 0xFA02
                    i.ROT(),                                // 0x58
                    i.STSLICER(),                           // 0xCF16
                    i.SWAP(),                               // 0x0 1
                    i.STSLICER(),                           // 0xCF16
                    i.ENDC(),                               // 0xC9
                    i.GETGLOB(2),                           // 0xF85_ 14_
                    i.REWRITESTDADDR(),                     // 0xFA44
                    i.POP(1),                               // 0x3 1
                    i.ROTREV(),                             // 0x59
                    i.PUSH(0),                              // 0x2 0
                    i.HASHCU(),                             // 0xF900
                    i.PUSH(2),                              // 0x2 2
                    i.HASHCU(),                             // 0xF900
                    i.SWAP2(),                              // 0x5A
                    i.CDEPTH(),                             // 0xD765
                    i.SWAP(),                               // 0x0 1
                    i.CDEPTH(),                             // 0xD765
                    i.PUSHINT_LONG(131380n),                    // 0x82 020134
                    i.NEWC(),                               // 0xC8
                    i.STU(24),                              // 0xCB 17
                    i.STU(16),                              // 0xCB 0F
                    i.STU(16),                              // 0xCB 0F
                    i.STU(256),                             // 0xCB FF
                    i.STU(256),                             // 0xCB FF
                    i.PUSHINT(1),                           // 0x7 1
                    i.HASHEXT(Hash.SHA256),                     // 0xF90400
                    i.SWAP(),                               // 0x0 1
                    i.EQUAL(),                              // 0xBA
                    i.NOT(),                                // 0xB3
                    i.PUSHCONT([
                        i.GETGLOB(2),                         // 0xF85_ 14_
                        i.PUSH(9),                            // 0x2 9
                        i.SDEQ(),                             // 0xC705
                        i.THROWIFNOT(707),                    // 0xF2E4_ 587_
                    ]),                                     // 0x9 F84229C705F2E2C3
                    i.IF(),                                 // 0xDE
                    i.GETGLOB(1),                           // 0xF85_ 0C_
                    i.UNTUPLE(4),                           // 0x6F2 4
                    i.PUSH(1),                              // 0x2 1
                    i.GETPARAM(7),                          // 0xF82 7
                    i.INDEX(0),                             // 0x6F1 0
                    i.PUSH(1),                              // 0x2 1
                    i.SUB(),                                // 0xA1
                    i.PUSHINT_LONG(10000000n),                  // 0x82 08989680
                    i.TUCK(),                               // 0x66
                    i.MIN(),                                // 0xB608
                    i.SUB(),                                // 0xA1
                    i.PUSHREF([
                        i.PUSHINT_LONG(15000000n),                // 0x82 08E4E1C0
                        i.ADD(),                              // 0xA0
                        i.SUB(),                              // 0xA1
                        i.PUSH(11),                           // 0x2 B
                        i.GTINT(0),                           // 0xC2 00
                        i.PUSHCONT([
                            i.BLKSWAP(4 , 1),                   // 0x55 3 0
                            i.LDMSGADDR(),                      // 0xFA40
                            i.LDGRAMS(),                        // 0xFA00
                            i.PUSHINT(1),                       // 0x7 1
                            i.SDSKIPFIRST(),                    // 0xD721
                            i.LDGRAMS(),                        // 0xFA00
                            i.LDGRAMS(),                        // 0xFA00
                            i.POP(0),                           // 0x3 0
                            i.BLKDROP2([6 , 1]),                // 0x6C 6 1
                            i.PUSHINT(0),                       // 0x7 0
                            i.GETORIGINALFWDFEE(),              // 0xF83A
                            i.PUXC(8 , -1),                     // 0x52 8 0
                            i.ADD(),                            // 0xA0
                            i.SUB(),                            // 0xA1
                            i.PUSHINT(1),                       // 0x7 1
                            i.PUSHINT(0),                       // 0x7 0
                            i.PUSH(7),                          // 0x2 7
                            i.XCHG3(7 , 1 , 3),                 // 0x4 7 1 3
                            i.XCHG2(6 , 9),                     // 0x50 6 9
                            i.NEWC(),                           // 0xC8
                            i.BLKSWAP(4 , 1),                   // 0x55 3 0
                            i.PUSHINT_LONG(1935855772n),            // 0x82 107362D09C
                            i.XCHG2(0 , 5),                     // 0x50 0 5
                            i.STU(32),                          // 0xCB 1F
                            i.XCHG_1([1, 3]),                   // 0x1 3
                            i.STU(64),                          // 0xCB 3F
                            i.SWAP(),                           // 0x0 1
                            i.STGRAMS(),                        // 0xFA02
                            i.SWAP(),                           // 0x0 1
                            i.STSLICER(),                       // 0xCF16
                            i.SWAP(),                           // 0x0 1
                            i.STSLICER(),                       // 0xCF16
                            i.ENDC(),                           // 0xC9
                            i.PUSH(8),                          // 0x2 8
                            i.XCHG_0(4),                        // 0x0 4
                            i.XCHG_1([3, 8]),                   // 0x10 3 8
                            i.XCHG3(5, 0, 0),                 // 0x4 5 0 0
                            i.XCHG3(4, 1, 3),                 // 0x4 4 1 3
                            i.ROTREV(),                         // 0x59
                            i.NEWC(),                           // 0xC8
                            i.STSLICECONST(beginCell().storeBits(new BitString(Buffer.from("40", "hex"), 0, 2)).asSlice()), // 0xCFC0_ 6_
                            i.STI(1),                           // 0xCA 00
                            i.STSLICECONST(beginCell().storeBits(new BitString(Buffer.from("00", "hex"), 0, 3)).asSlice()), // 0xCFC0_ 1_
                            i.STSLICE(),                        // 0xCE
                            i.SWAP(),                           // 0x0 1
                            i.STGRAMS(),                        // 0xFA02
                            i.PUSHINT_8(106),                   // 0x80 6A
                            i.STZEROES(),                       // 0xCF40
                            i.STDICT(),                         // 0xF400
                            i.ENDC(),                           // 0xC9
                            i.SWAP(),                           // 0x0 1
                            i.SENDRAWMSG(),                     // 0xFB00
                            i.XCHG_1([2, 3]),                   // 0x10 2 3
                        ]),                                   // 0x8F_ 5530FA40FA0071D721FA00FA00306C6170F83A5280A0A171702747135069C8553082107362D09C5005CB1F13CB3F01FA0201CF1601CF16C9280410384500441359C8CF8580CA00CF8440CE01FA02806ACF40F400C901FB001023
                        i.PUSHCONT([
                            i.POP(11),                          // 0x3 B
                            i.BLKDROP(4),                       // 0x5F0 4
                            i.POP(3),                           // 0x3 3
                            i.POP(4),                           // 0x3 4
                            i.POP(0),                           // 0x3 0
                        ]),                                   // 0x9 3B5F04333430
                        i.IFELSE(),                           // 0xE2
                        i.PUSHREF([
                            i.PUSH(2),                            // 0x2 2
                            i.ISNULL(),                           // 0x6E
                            i.NOT(),                              // 0xB3
                            i.PUSHCONT([
                                i.PUSH(3),                          // 0x2 3
                                i.GTINT(0),                         // 0xC2 00
                            ]),                                   // 0x9 23C200
                            i.PUSHCONT([
                                i.PUSHINT(0),                       // 0x7 0
                            ]),                                   // 0x9 70
                            i.IFELSE(),                           // 0xE2
                            i.PUSHREF([
                                i.PUSHCONT([
                                    i.BLKDROP2([3, 1]),                // 0x6C 3 1
                                ]),                                   // 0x9 6C31
                                i.IFREFELSE([
                                    i.PUSHINT(2),                       // 0x7 2
                                    i.PUSHINT(0),                       // 0x7 0
                                    i.XCHG_0(3),                        // 0x0 3
                                    i.NEWC(),                           // 0xC8
                                    i.SWAP(),                           // 0x0 1
                                    i.PUSHINT_LONG(3576854235n),            // 0x82 10D53276DB
                                    i.ROT(),                            // 0x58
                                    i.STU(32),                          // 0xCB 1F
                                    i.STU(64),                          // 0xCB 3F
                                    i.ENDC(),                           // 0xC9
                                    i.XCHG_1([3, 5]),                   // 0x10 3 5
                                    i.XCHG3(1, 5, 0),                 // 0x4 1 5 0
                                    i.XCHG3(4, 1, 3),                 // 0x4 4 1 3
                                    i.ROTREV(),                         // 0x59
                                    i.NEWC(),                           // 0xC8
                                    i.STSLICECONST(beginCell().storeBits(new BitString(Buffer.from("40", "hex"), 0, 2)).asSlice()), // 0xCFC0_ 6_
                                    i.STI(1),                           // 0xCA 00
                                    i.STSLICECONST(beginCell().storeBits(new BitString(Buffer.from("00", "hex"), 0, 3)).asSlice()), // 0xCFC0_ 1_
                                    i.STSLICE(),                        // 0xCE
                                    i.SWAP(),                           // 0x0 1
                                    i.STGRAMS(),                        // 0xFA02
                                    i.PUSHINT_8(106),                   // 0x80 6A
                                    i.STZEROES(),                       // 0xCF40
                                    i.STDICT(),                         // 0xF400
                                    i.ENDC(),                           // 0xC9
                                    i.SWAP(),                           // 0x0 1
                                    i.SENDRAWMSG(),                     // 0xFB00
                                ]),                                   // 0xE30D 727003C8018210D53276DB58CB1FCB3FC910354150441359C8CF8580CA00CF8440CE01FA02806ACF40F400C901FB00
                                i.XCHG_0(2),                          // 0x0 2
                                i.PUSHREF([
                                    i.NEWC(),                           // 0xC8
                                    i.BLKSWAP(3 , 1),                   // 0x55 2 0
                                    i.SWAP2(),                          // 0x5A
                                    i.STGRAMS(),                        // 0xFA02
                                    i.ROT(),                            // 0x58
                                    i.STSLICER(),                       // 0xCF16
                                    i.SWAP(),                           // 0x0 1
                                    i.STSLICER(),                       // 0xCF16
                                    i.ENDC(),                           // 0xC9
                                    i.POPCTR(4),                        // 0xED5 4
                                ]),                                   // 0x88
                            ])
                        ])
                    ]),                                     // 0x88
                ])
            ]),                                       // 0xE302 31D33FFA00FA4020D70B01C30093FA40019472D7216DE201FA00515515144330365163A0705339F82AC855215AFA0258CF1601CF16C9F842FA44315920F90022F9005AD76501D76582020134C8CB17CB0FCB0FCBFFCBFF71F9040001BAB398F84229C705F2E2C3DEF8416F2421F8276F1021A1820898968066B608A1
            i.SWAP(),                                 // 0x0 1
            i.PUSHINT_LONG(1499400124n),                  // 0x82 10595F07BC
            i.EQUAL(),                                // 0xBA
            i.PUSHREF([
                i.IFJMPREF([
                    i.LDU(64),                            // 0xD3 3F
                    i.LDGRAMS(),                          // 0xFA00
                    i.LDMSGADDR(),                        // 0xFA40
                    i.LDI(1),                             // 0xD2 00
                    i.SWAP(),                             // 0x0 1
                    i.PUSHCONT([
                        i.LDREF(),                          // 0xD4
                    ]),                                   // 0x9 D4
                    i.PUSHCONT([
                        i.PUSHNULL(),                       // 0x6D
                        i.SWAP(),                           // 0x0 1
                    ]),                                   // 0x9 6D01
                    i.IFELSE(),                           // 0xE2
                    i.BLKSWAP(4, 1),                     // 0x55 3 0
                    i.POP(0),                             // 0x3 0
                    i.POP(3),                             // 0x3 3
                    i.GETGLOB(2),                         // 0xF85_ 14_
                    i.PUXC(5, -1),                       // 0x52 5 0
                    i.SDEQ(),                             // 0xC705
                    i.THROWIFNOT(705),                    // 0xF2E4_ 583_
                    i.XCPU(3, 3),                        // 0x51 3 3
                    i.SUB(),                              // 0xA1
                    i.PUSH(0),                            // 0x2 0
                    i.GTINT(-1),                          // 0xC2 FF
                    i.THROWIFNOT(706),                    // 0xF2E4_ 585_
                    i.GETGLOB(1),                         // 0xF85_ 0C_
                    i.UNTUPLE(4),                         // 0x6F2 4
                    i.XCHG3(3 , 3 , 0),                   // 0x4 3 3 0
                    i.PUXC(3 , -1),                       // 0x52 3 0
                    i.LDMSGADDR(),                        // 0xFA40
                    i.LDGRAMS(),                          // 0xFA00
                    i.PUSHINT(1),                         // 0x7 1
                    i.SDSKIPFIRST(),                      // 0xD721
                    i.LDGRAMS(),                          // 0xFA00
                    i.LDGRAMS(),                          // 0xFA00
                    i.POP(0),                             // 0x3 0
                    i.BLKDROP2([6 , 1]),                  // 0x6C 6 1
                    i.PUSHINT(0),                         // 0x7 0
                    i.GETORIGINALFWDFEE(),                // 0xF83A
                    i.PUSHINT_LONG(30000000n),                // 0x82 09C9C380
                    i.ADD(),                              // 0xA0
                    i.GREATER(),                          // 0xBC
                    i.PUSHREF([
                        i.THROWIFNOT(707),                    // 0xF2E4_ 587_
                        i.PUSHINT(0),                         // 0x7 0
                        i.PUSHINT_8(64),                      // 0x80 40
                        i.XC2PU(3 , 5 , 6),                   // 0x541 3 5 6
                        i.PUSHINT(-1),                        // 0x7 F
                        i.XCHG_0(6),                          // 0x0 6
                        i.NEWC(),                             // 0xC8
                        i.BLKSWAP(4 , 1),                     // 0x55 3 0
                        i.PUSHINT_LONG(2078119902n),              // 0x82 107BDD97DE
                        i.XCHG2(0 , 5),                       // 0x50 0 5
                        i.STU(32),                            // 0xCB 1F
                        i.XCHG_1([1, 3]),                     // 0x1 3
                        i.STU(64),                            // 0xCB 3F
                        i.SWAP(),                             // 0x0 1
                        i.STGRAMS(),                          // 0xFA02
                        i.SWAP(),                             // 0x0 1
                        i.STSLICER(),                         // 0xCF16
                        i.SWAP(),                             // 0x0 1
                        i.STSLICER(),                         // 0xCF16
                        i.ENDC(),                             // 0xC9
                    ]),
                    i.PUSHREF([
                        i.PUSH(6),                            // 0x2 6
                        i.XCHG3(5 , 4 , 4),                   // 0x4 5 4 4
                        i.XCHG3(4 , 1 , 3),                   // 0x4 4 1 3
                        i.ROTREV(),                           // 0x59
                        i.NEWC(),                             // 0xC8
                        i.STSLICECONST(beginCell().storeBits(new BitString(Buffer.from("40", "hex"), 0, 2)).asSlice()), // 0xCFC0_ 6_
                        i.STI(1),                             // 0xCA 00
                        i.STSLICECONST(beginCell().storeBits(new BitString(Buffer.from("00", "hex"), 0, 3)).asSlice()), // 0xCFC0_ 1_
                        i.STSLICE(),                          // 0xCE
                        i.SWAP(),                             // 0x0 1
                        i.STGRAMS(),                          // 0xFA02
                        i.PUSHINT_8(106),                     // 0x80 6A
                        i.PUSHREF([
                            i.STZEROES(),                       // 0xCF40
                            i.STDICT(),                         // 0xF400
                            i.ENDC(),                           // 0xC9
                            i.SWAP(),                           // 0x0 1
                            i.SENDRAWMSG(),                     // 0xFB00
                            i.XCHG_0(2),                        // 0x0 2
                            i.NEWC(),                           // 0xC8
                            i.BLKSWAP(3 , 1),                   // 0x55 2 0
                            i.SWAP2(),                          // 0x5A
                            i.STGRAMS(),                        // 0xFA02
                            i.ROT(),                            // 0x58
                            i.STSLICER(),                       // 0xCF16
                            i.SWAP(),                           // 0x0 1
                            i.STSLICER(),                       // 0xCF16
                            i.ENDC(),                           // 0xC9
                            i.POPCTR(4),                        // 0xED5 4
                        ]),                                   // 0x88
                    ])
                ]),                                     // 0xE302 D33FFA00FA40D2000191D4926D01E255303033F8425250C705F2E2C15133A120C2FFF2E2C2F8416F2443305230FA40FA0071D721FA00FA00306C6170F83A8209C9C380A0BCF2E2C37080405413567F06C8553082107BDD97DE5005CB1F13CB3F01FA0201CF1601CF16C9264544441359C8CF8580CA00CF8440CE01FA02806A
                i.BLKDROP(4),                           // 0x5F0 4
                i.THROW(130),                           // 0xF2C4_ 105_
            ]),                                       // 0x88
        ])
      ]),                                         // 0x88
    ]],
    [97026, [
      i.PUSHCTR(4),                               // 0xED4 4
      i.CTOS(),                                   // 0xD0
      i.LDGRAMS(),                                // 0xFA00
      i.LDMSGADDR(),                              // 0xFA40
      i.LDMSGADDR(),                              // 0xFA40
      i.BLKSWAP(3 , 1),                           // 0x55 2 0
      i.BLKDROP2([1 , 3]),                        // 0x6C 1 3
      i.GETPARAM(10),                             // 0xF82 A
      i.PU2XC(3 , 2 , -2),                        // 0x546 3 3 0
      i.PUXC(3 , -1),                             // 0x52 3 0
      i.BLKDROP2([3 , 4]),                        // 0x6C 3 4
    ]],
  ])),
  i.DICTIGETJMPZ(),
];
