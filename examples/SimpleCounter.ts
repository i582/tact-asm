import * as i from "../src/instructions";

export const instructions = [
  i.SETCP(0),
  i.DUP(),

  i.PUSHCONT([
      i.POP_LONG(0),                                   // 0x3 0
      i.SWAP(),                                // 0x0 1
      i.CTOS(),                                   // 0xD0
      i.PUSHINT(2),                               // 0x7 2
      i.SDSKIPFIRST(),                            // 0xD721
      i.LDI(1),                                   // 0xD2 00
      i.LDI(1),                                   // 0xD2 00
      i.LDMSGADDR(),                              // 0xFA40
      i.PUSH_LONG(1),                                  // 0x2 1
      i.XCHG_1([3, 4]),                           // 0x10 3 4
      i.XCHG2(6 , 6),                             // 0x50 6 6
      i.TUPLE(4),                                 // 0x6F0 4
      i.SETGLOB(1),                               // 0xF87_ 0C_
      i.XCHG_0(2),                                   // 0x0 2
      i.SETGLOB(2),                               // 0xF87_ 14_
      i.PUSHCTR(4),                               // 0xED4 4
      i.CTOS(),                                   // 0xD0
      i.LDI(1),                                   // 0xD2 00
      i.SWAP(),                                   // 0x0 1
      i.PUSHCONT([
          i.LDU(32),                                // 0xD3 1F
          i.LDU(32),                                // 0xD3 1F
          i.ROTREV(),                               // 0x59
          i.BLKDROP2(1 , 2),                      // 0x6C 1 2
      ]),                                         // 0x9 D31FD31F596C12
      i.PUSHCONT([
          i.PUSHINT_8(257),                         // 0x81 0101
          i.LDIX(),                                 // 0xD700
          i.XCHG_0(1),                              // 0x0 1
          i.XCHG_0(1),                              // 0x0 1
          i.ENDS(),                                 // 0xD1
          i.PUSHINT(0),                             // 0x7 0
      ]),                                         // 0x9 810101D7000101D170
      i.IFELSE(),                                 // 0xE2
      i.XCHG_0(3),                                // 0x0 3
      i.PUSHCONT([
          i.BLKDROP(3),                             // 0x5F0 3
      ]),                                         // 0x9 5F03
      i.IFJMP(),                                  // 0xE0
      i.PUSHINT(0),                               // 0x7 0
      i.PUSH_LONG(2),                                  // 0x2 2
      i.SBITS(),                                  // 0xD749
      i.PUSH_LONG(0),                                  // 0x2 0
      i.GTINT(31),                                // 0xC2 1F
      i.PUSHREF([
          i.PUSHCONT([
              i.POP(1),                                 // 0x3 1
              i.XCHG_0(2),                              // 0x0 2
              i.LDU(32),                                // 0xD3 1F
              i.XCHG_0(3),                              // 0x0 3
          ]),                                         // 0x9 3102D31F03
          i.IF(),                                     // 0xDE
          i.PUSH_LONG(1),                                  // 0x2 1
          i.PUSHINT_LONG(2335447074n),                    // 0x82 108B341822
          i.EQUAL(),                                  // 0xBA
          i.PUSHREF([
              i.DROP2(),                                // 0x5B
              i.XCHG_0(1),                              // 0x0 1
              i.LDU(64),                                // 0xD3 3F
              i.LDU(32),                                // 0xD3 1F
              i.ROTREV(),                               // 0x59
              i.BLKDROP2(2 , 1),                      // 0x6C 2 1
              i.XCHG_3(1, 2),                         // 0x1 2
              i.ADD(),                                  // 0xA0
              i.NEWC(),                                 // 0xC8
              i.PUSHINT(-1),                            // 0x7 F
              i.XCHG_0(1),                              // 0x0 1
              i.STI(1),                                 // 0xCA 00
              i.ROTREV(),                               // 0x59
              i.XCHG_0(2),                              // 0x0 2
              i.STU(32),                                // 0xCB 1F
              i.STU(32),                                // 0xCB 1F
              i.ENDC(),                                 // 0xC9
              i.POPCTR(4),                              // 0xED5 4
          ]),                                         // 0x8F_ 5B01D33FD31F596C2112A0C87F01CA005902CB1FCB1FC9ED54
          i.IFJMP(),                                  // 0xE0
          i.POP(3),                                   // 0x3 3
          i.EQINT(0),                                 // 0xC0 00
          i.XCHG_0(2),                                // 0x0 2
          i.LESSINT(33),                              // 0xC1 21
          i.XCHG_3(1, 2),                           // 0x1 2
          i.AND(),                                    // 0xB0
          i.IFJMPREF([
              i.XCHG_0(1),                              // 0x0 1
              i.NEWC(),                                 // 0xC8
              i.PUSHINT(-1),                            // 0x7 F
              i.XCHG_0(1),                              // 0x0 1
              i.STI(1),                                 // 0xCA 00
              i.ROTREV(),                               // 0x59
              i.XCHG_0(2),                              // 0x0 2
              i.STU(32),                                // 0xCB 1F
              i.STU(32),                                // 0xCB 1F
              i.ENDC(),                                 // 0xC9
              i.POPCTR(4),                              // 0xED5 4
          ]),                                         // 0xE302 01C87F01CA005902CB1FCB1FC9ED54
          i.DROP2(),                                  // 0x5B
          i.THROW(130),                               // 0xF2C4_ 105_
      ]),
  ]),
  i.IFNOTJMP(),
  i.PUSHDICTCONST(new Map([
    [104984, [
      i.PUSHCTR(4),                               // 0xED4 4
      i.CTOS(),                                   // 0xD0
      i.LDI(1),                                   // 0xD2 00
      i.SWAP(),                                    // 0x0 1
      i.PUSHCONT([
        i.LDU(32),                                // 0xD3 1F
        i.LDU(32),                                // 0xD3 1F
        i.ROTREV(),                               // 0x59
        i.BLKDROP2(1 , 2),                      // 0x6C 1 2
      ]),                                         // 0x9 D31FD31F596C12
      i.PUSHCONT([
        i.PUSHINT_8(257),                         // 0x81 0101
        i.LDIX(),                                 // 0xD700
        i.SWAP(),                              // 0x0 1
        i.SWAP(),                              // 0x0 1
        i.ENDS(),                                 // 0xD1
        i.PUSHINT(0),                             // 0x7 0
      ]),                                         // 0x9 810101D7000101D170
      i.IFELSE(),                                 // 0xE2
      i.CALLREF([
        i.PUSH_LONG(0),                                // 0x2 0
      ]),                                         // 0xDB3C 20
      i.BLKDROP2(2 , 1),                        // 0x6C 2 1
    ]],
    [105872, [
      i.PUSHCTR(4),                               // 0xED4 4
      i.CTOS(),                                   // 0xD0
      i.LDI(1),                                   // 0xD2 00
      i.SWAP(),                                   // 0x0 1
      i.PUSHCONT([
        i.LDU(32),                                // 0xD3 1F
        i.LDU(32),                                // 0xD3 1F
        i.ROTREV(),                               // 0x59
        i.BLKDROP2(1 , 2),                      // 0x6C 1 2
      ]),                                         // 0x9 D31FD31F596C12
      i.PUSHCONT([
        i.PUSHINT_8(257),                         // 0x81 0101
        i.LDIX(),                                 // 0xD700
        i.SWAP(),                              // 0x0 1
        i.SWAP(),                              // 0x0 1
        i.ENDS(),                                 // 0xD1
        i.PUSHINT(0),                             // 0x7 0
      ]),                                         // 0x9 810101D7000101D170
      i.IFELSE(),                                 // 0xE2
      i.CALLREF([
        i.PUSH_LONG(1),                                // 0x2 1
      ]),                                         // 0xDB3C 21
      i.BLKDROP2(2 , 1),                        // 0x6C 2 1
    ]],
  ])),
  i.DICTIGETJMPZ(),
];
