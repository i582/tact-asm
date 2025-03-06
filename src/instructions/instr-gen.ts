import {
    createSimpleInstr,
    createUnaryInstr,
    createBinaryInstr,
    createTernaryInstr,
    createFixedRangeInstr,
} from "./instr"
import {
    uint,
    int,
    hash,
    tinyInt,
    plduzArg,
    xchgArgs,
    minusOne,
    delta,
    seq2,
    stack,
    control,
    s1,
} from "./asm1"

export const PUSHNAN = () => createSimpleInstr("PUSHNAN", 0x83ff, 16);
export const ADD = () => createSimpleInstr("ADD", 0xa0, 8);
export const SUB = () => createSimpleInstr("SUB", 0xa1, 8);
export const SUBR = () => createSimpleInstr("SUBR", 0xa2, 8);
export const NEGATE = () => createSimpleInstr("NEGATE", 0xa3, 8);
export const INC = () => createSimpleInstr("INC", 0xa4, 8);
export const DEC = () => createSimpleInstr("DEC", 0xa5, 8);
export const MUL = () => createSimpleInstr("MUL", 0xa8, 8);
export const POW2 = () => createSimpleInstr("POW2", 0xae, 8);
export const AND = () => createSimpleInstr("AND", 0xb0, 8);
export const OR = () => createSimpleInstr("OR", 0xb1, 8);
export const XOR = () => createSimpleInstr("XOR", 0xb2, 8);
export const NOT = () => createSimpleInstr("NOT", 0xb3, 8);
export const FITSX = () => createSimpleInstr("FITSX", 0xb600, 16);
export const UFITSX = () => createSimpleInstr("UFITSX", 0xb601, 16);
export const BITSIZE = () => createSimpleInstr("BITSIZE", 0xb602, 16);
export const UBITSIZE = () => createSimpleInstr("UBITSIZE", 0xb603, 16);
export const MIN = () => createSimpleInstr("MIN", 0xb608, 16);
export const MAX = () => createSimpleInstr("MAX", 0xb609, 16);
export const MINMAX = () => createSimpleInstr("MINMAX", 0xb60a, 16);
export const ABS = () => createSimpleInstr("ABS", 0xb60b, 16);
export const QADD = () => createSimpleInstr("QADD", 0xb7a0, 16);
export const QSUB = () => createSimpleInstr("QSUB", 0xb7a1, 16);
export const QSUBR = () => createSimpleInstr("QSUBR", 0xb7a2, 16);
export const QNEGATE = () => createSimpleInstr("QNEGATE", 0xb7a3, 16);
export const QINC = () => createSimpleInstr("QINC", 0xb7a4, 16);
export const QDEC = () => createSimpleInstr("QDEC", 0xb7a5, 16);
export const QMUL = () => createSimpleInstr("QMUL", 0xb7a8, 16);
export const QPOW2 = () => createSimpleInstr("QPOW2", 0xb7ae, 16);
export const QAND = () => createSimpleInstr("QAND", 0xb7b0, 16);
export const QOR = () => createSimpleInstr("QOR", 0xb7b1, 16);
export const QXOR = () => createSimpleInstr("QXOR", 0xb7b2, 16);
export const QNOT = () => createSimpleInstr("QNOT", 0xb7b3, 16);
export const QFITSX = () => createSimpleInstr("QFITSX", 0xb7b600, 24);
export const QUFITSX = () => createSimpleInstr("QUFITSX", 0xb7b601, 24);
export const QBITSIZE = () => createSimpleInstr("QBITSIZE", 0xb7b602, 24);
export const QUBITSIZE = () => createSimpleInstr("QUBITSIZE", 0xb7b603, 24);
export const QMIN = () => createSimpleInstr("QMIN", 0xb7b608, 24);
export const QMAX = () => createSimpleInstr("QMAX", 0xb7b609, 24);
export const QMINMAX = () => createSimpleInstr("QMINMAX", 0xb7b60a, 24);
export const QABS = () => createSimpleInstr("QABS", 0xb7b60b, 24);
export const SGN = () => createSimpleInstr("SGN", 0xb8, 8);
export const LESS = () => createSimpleInstr("LESS", 0xb9, 8);
export const EQUAL = () => createSimpleInstr("EQUAL", 0xba, 8);
export const LEQ = () => createSimpleInstr("LEQ", 0xbb, 8);
export const GREATER = () => createSimpleInstr("GREATER", 0xbc, 8);
export const NEQ = () => createSimpleInstr("NEQ", 0xbd, 8);
export const GEQ = () => createSimpleInstr("GEQ", 0xbe, 8);
export const CMP = () => createSimpleInstr("CMP", 0xbf, 8);
export const ISNAN = () => createSimpleInstr("ISNAN", 0xc4, 8);
export const CHKNAN = () => createSimpleInstr("CHKNAN", 0xc5, 8);
export const QSGN = () => createSimpleInstr("QSGN", 0xb7b8, 16);
export const QLESS = () => createSimpleInstr("QLESS", 0xb7b9, 16);
export const QEQUAL = () => createSimpleInstr("QEQUAL", 0xb7ba, 16);
export const QLEQ = () => createSimpleInstr("QLEQ", 0xb7bb, 16);
export const QGREATER = () => createSimpleInstr("QGREATER", 0xb7bc, 16);
export const QNEQ = () => createSimpleInstr("QNEQ", 0xb7bd, 16);
export const QGEQ = () => createSimpleInstr("QGEQ", 0xb7be, 16);
export const QCMP = () => createSimpleInstr("QCMP", 0xb7bf, 16);
export const SEMPTY = () => createSimpleInstr("SEMPTY", 0xc700, 16);
export const SDEMPTY = () => createSimpleInstr("SDEMPTY", 0xc701, 16);
export const SREMPTY = () => createSimpleInstr("SREMPTY", 0xc702, 16);
export const SDFIRST = () => createSimpleInstr("SDFIRST", 0xc703, 16);
export const SDLEXCMP = () => createSimpleInstr("SDLEXCMP", 0xc704, 16);
export const SDEQ = () => createSimpleInstr("SDEQ", 0xc705, 16);
export const SDPFX = () => createSimpleInstr("SDPFX", 0xc708, 16);
export const SDPFXREV = () => createSimpleInstr("SDPFXREV", 0xc709, 16);
export const SDPPFX = () => createSimpleInstr("SDPPFX", 0xc70a, 16);
export const SDPPFXREV = () => createSimpleInstr("SDPPFXREV", 0xc70b, 16);
export const SDSFX = () => createSimpleInstr("SDSFX", 0xc70c, 16);
export const SDSFXREV = () => createSimpleInstr("SDSFXREV", 0xc70d, 16);
export const SDPSFX = () => createSimpleInstr("SDPSFX", 0xc70e, 16);
export const SDPSFXREV = () => createSimpleInstr("SDPSFXREV", 0xc70f, 16);
export const SDCNTLEAD0 = () => createSimpleInstr("SDCNTLEAD0", 0xc710, 16);
export const SDCNTLEAD1 = () => createSimpleInstr("SDCNTLEAD1", 0xc711, 16);
export const SDCNTTRAIL0 = () => createSimpleInstr("SDCNTTRAIL0", 0xc712, 16);
export const SDCNTTRAIL1 = () => createSimpleInstr("SDCNTTRAIL1", 0xc713, 16);
export const NEWC = () => createSimpleInstr("NEWC", 0xc8, 8);
export const ENDC = () => createSimpleInstr("ENDC", 0xc9, 8);
export const ENDCST = () => createSimpleInstr("ENDCST", 0xcd, 8);
export const STBREF = () => createSimpleInstr("STBREF", 0xcf11, 16);
export const STB = () => createSimpleInstr("STB", 0xcf13, 16);
export const STREFR = () => createSimpleInstr("STREFR", 0xcf14, 16);
export const STBREFR = () => createSimpleInstr("STBREFR", 0xcf15, 16);
export const STSLICER = () => createSimpleInstr("STSLICER", 0xcf16, 16);
export const STBR = () => createSimpleInstr("STBR", 0xcf17, 16);
export const STREFQ = () => createSimpleInstr("STREFQ", 0xcf18, 16);
export const STBREFQ = () => createSimpleInstr("STBREFQ", 0xcf19, 16);
export const STSLICEQ = () => createSimpleInstr("STSLICEQ", 0xcf1a, 16);
export const STBQ = () => createSimpleInstr("STBQ", 0xcf1b, 16);
export const STREFRQ = () => createSimpleInstr("STREFRQ", 0xcf1c, 16);
export const STBREFRQ = () => createSimpleInstr("STBREFRQ", 0xcf1d, 16);
export const STSLICERQ = () => createSimpleInstr("STSLICERQ", 0xcf1e, 16);
export const STBRQ = () => createSimpleInstr("STBRQ", 0xcf1f, 16);
export const ENDXC = () => createSimpleInstr("ENDXC", 0xcf23, 16);
export const BDEPTH = () => createSimpleInstr("BDEPTH", 0xcf30, 16);
export const BBITS = () => createSimpleInstr("BBITS", 0xcf31, 16);
export const BREFS = () => createSimpleInstr("BREFS", 0xcf32, 16);
export const BBITREFS = () => createSimpleInstr("BBITREFS", 0xcf33, 16);
export const BREMBITS = () => createSimpleInstr("BREMBITS", 0xcf35, 16);
export const BREMREFS = () => createSimpleInstr("BREMREFS", 0xcf36, 16);
export const BREMBITREFS = () => createSimpleInstr("BREMBITREFS", 0xcf37, 16);
export const BCHKREFS = () => createSimpleInstr("BCHKREFS", 0xcf3a, 16);
export const BCHKBITREFS = () => createSimpleInstr("BCHKBITREFS", 0xcf3b, 16);
export const BCHKREFSQ = () => createSimpleInstr("BCHKREFSQ", 0xcf3e, 16);
export const BCHKBITREFSQ = () => createSimpleInstr("BCHKBITREFSQ", 0xcf3f, 16);
export const STZEROES = () => createSimpleInstr("STZEROES", 0xcf40, 16);
export const STONES = () => createSimpleInstr("STONES", 0xcf41, 16);
export const STSAME = () => createSimpleInstr("STSAME", 0xcf42, 16);
export const CTOS = () => createSimpleInstr("CTOS", 0xd0, 8);
export const ENDS = () => createSimpleInstr("ENDS", 0xd1, 8);
export const LDREF = () => createSimpleInstr("LDREF", 0xd4, 8);
export const LDREFRTOS = () => createSimpleInstr("LDREFRTOS", 0xd5, 8);
export const SDCUTFIRST = () => createSimpleInstr("SDCUTFIRST", 0xd720, 16);
export const SDSKIPFIRST = () => createSimpleInstr("SDSKIPFIRST", 0xd721, 16);
export const SDCUTLAST = () => createSimpleInstr("SDCUTLAST", 0xd722, 16);
export const SDSKIPLAST = () => createSimpleInstr("SDSKIPLAST", 0xd723, 16);
export const SDSUBSTR = () => createSimpleInstr("SDSUBSTR", 0xd724, 16);
export const SCUTFIRST = () => createSimpleInstr("SCUTFIRST", 0xd730, 16);
export const SSKIPFIRST = () => createSimpleInstr("SSKIPFIRST", 0xd731, 16);
export const SCUTLAST = () => createSimpleInstr("SCUTLAST", 0xd732, 16);
export const SSKIPLAST = () => createSimpleInstr("SSKIPLAST", 0xd733, 16);
export const SUBSLICE = () => createSimpleInstr("SUBSLICE", 0xd734, 16);
export const SPLIT = () => createSimpleInstr("SPLIT", 0xd736, 16);
export const SPLITQ = () => createSimpleInstr("SPLITQ", 0xd737, 16);
export const XCTOS = () => createSimpleInstr("XCTOS", 0xd739, 16);
export const XLOAD = () => createSimpleInstr("XLOAD", 0xd73a, 16);
export const XLOADQ = () => createSimpleInstr("XLOADQ", 0xd73b, 16);
export const SCHKBITS = () => createSimpleInstr("SCHKBITS", 0xd741, 16);
export const SCHKREFS = () => createSimpleInstr("SCHKREFS", 0xd742, 16);
export const SCHKBITREFS = () => createSimpleInstr("SCHKBITREFS", 0xd743, 16);
export const SCHKBITSQ = () => createSimpleInstr("SCHKBITSQ", 0xd745, 16);
export const SCHKREFSQ = () => createSimpleInstr("SCHKREFSQ", 0xd746, 16);
export const SCHKBITREFSQ = () => createSimpleInstr("SCHKBITREFSQ", 0xd747, 16);
export const PLDREFVAR = () => createSimpleInstr("PLDREFVAR", 0xd748, 16);
export const SBITS = () => createSimpleInstr("SBITS", 0xd749, 16);
export const SREFS = () => createSimpleInstr("SREFS", 0xd74a, 16);
export const SBITREFS = () => createSimpleInstr("SBITREFS", 0xd74b, 16);
export const LDZEROES = () => createSimpleInstr("LDZEROES", 0xd760, 16);
export const LDONES = () => createSimpleInstr("LDONES", 0xd761, 16);
export const LDSAME = () => createSimpleInstr("LDSAME", 0xd762, 16);
export const SDEPTH = () => createSimpleInstr("SDEPTH", 0xd764, 16);
export const CDEPTH = () => createSimpleInstr("CDEPTH", 0xd765, 16);
export const CLEVEL = () => createSimpleInstr("CLEVEL", 0xd766, 16);
export const CLEVELMASK = () => createSimpleInstr("CLEVELMASK", 0xd767, 16);
export const CHASHIX = () => createSimpleInstr("CHASHIX", 0xd770, 16);
export const CDEPTHIX = () => createSimpleInstr("CDEPTHIX", 0xd771, 16);
export const EXECUTE = () => createSimpleInstr("EXECUTE", 0xd8, 8);
export const JMPX = () => createSimpleInstr("JMPX", 0xd9, 8);
export const RET = () => createSimpleInstr("RET", 0xdb30, 16);
export const RETALT = () => createSimpleInstr("RETALT", 0xdb31, 16);
export const RETBOOL = () => createSimpleInstr("RETBOOL", 0xdb32, 16);
export const CALLCC = () => createSimpleInstr("CALLCC", 0xdb34, 16);
export const JMPXDATA = () => createSimpleInstr("JMPXDATA", 0xdb35, 16);
export const CALLXVARARGS = () => createSimpleInstr("CALLXVARARGS", 0xdb38, 16);
export const RETVARARGS = () => createSimpleInstr("RETVARARGS", 0xdb39, 16);
export const JMPXVARARGS = () => createSimpleInstr("JMPXVARARGS", 0xdb3a, 16);
export const CALLCCVARARGS = () => createSimpleInstr("CALLCCVARARGS", 0xdb3b, 16);
export const RETDATA = () => createSimpleInstr("RETDATA", 0xdb3f, 16);
export const RUNVMX = () => createSimpleInstr("RUNVMX", 0xdb50, 16);
export const IFRET = () => createSimpleInstr("IFRET", 0xdc, 8);
export const IFNOTRET = () => createSimpleInstr("IFNOTRET", 0xdd, 8);
export const IF = () => createSimpleInstr("IF", 0xde, 8);
export const IFNOT = () => createSimpleInstr("IFNOT", 0xdf, 8);
export const IFJMP = () => createSimpleInstr("IFJMP", 0xe0, 8);
export const IFNOTJMP = () => createSimpleInstr("IFNOTJMP", 0xe1, 8);
export const IFELSE = () => createSimpleInstr("IFELSE", 0xe2, 8);
export const CONDSEL = () => createSimpleInstr("CONDSEL", 0xe304, 16);
export const CONDSELCHK = () => createSimpleInstr("CONDSELCHK", 0xe305, 16);
export const IFRETALT = () => createSimpleInstr("IFRETALT", 0xe308, 16);
export const IFNOTRETALT = () => createSimpleInstr("IFNOTRETALT", 0xe309, 16);
export const REPEAT = () => createSimpleInstr("REPEAT", 0xe4, 8);
export const REPEATEND = () => createSimpleInstr("REPEATEND", 0xe5, 8);
export const UNTIL = () => createSimpleInstr("UNTIL", 0xe6, 8);
export const UNTILEND = () => createSimpleInstr("UNTILEND", 0xe7, 8);
export const WHILE = () => createSimpleInstr("WHILE", 0xe8, 8);
export const WHILEEND = () => createSimpleInstr("WHILEEND", 0xe9, 8);
export const AGAIN = () => createSimpleInstr("AGAIN", 0xea, 8);
export const AGAINEND = () => createSimpleInstr("AGAINEND", 0xeb, 8);
export const REPEATBRK = () => createSimpleInstr("REPEATBRK", 0xe314, 16);
export const REPEATENDBRK = () => createSimpleInstr("REPEATENDBRK", 0xe315, 16);
export const UNTILBRK = () => createSimpleInstr("UNTILBRK", 0xe316, 16);
export const UNTILENDBRK = () => createSimpleInstr("UNTILENDBRK", 0xe317, 16);
export const WHILEBRK = () => createSimpleInstr("WHILEBRK", 0xe318, 16);
export const WHILEENDBRK = () => createSimpleInstr("WHILEENDBRK", 0xe319, 16);
export const AGAINBRK = () => createSimpleInstr("AGAINBRK", 0xe31a, 16);
export const AGAINENDBRK = () => createSimpleInstr("AGAINENDBRK", 0xe31b, 16);
export const RETURNVARARGS = () => createSimpleInstr("RETURNVARARGS", 0xed10, 16);
export const SETCONTVARARGS = () => createSimpleInstr("SETCONTVARARGS", 0xed11, 16);
export const SETNUMVARARGS = () => createSimpleInstr("SETNUMVARARGS", 0xed12, 16);
export const BLESS = () => createSimpleInstr("BLESS", 0xed1e, 16);
export const BLESSVARARGS = () => createSimpleInstr("BLESSVARARGS", 0xed1f, 16);
export const PUSHCTRX = () => createSimpleInstr("PUSHCTRX", 0xede0, 16);
export const POPCTRX = () => createSimpleInstr("POPCTRX", 0xede1, 16);
export const SETCONTCTRX = () => createSimpleInstr("SETCONTCTRX", 0xede2, 16);
export const SETCONTCTRMANYX = () => createSimpleInstr("SETCONTCTRMANYX", 0xede4, 16);
export const BOOLAND = () => createSimpleInstr("BOOLAND", 0xedf0, 16);
export const BOOLOR = () => createSimpleInstr("BOOLOR", 0xedf1, 16);
export const COMPOSBOTH = () => createSimpleInstr("COMPOSBOTH", 0xedf2, 16);
export const ATEXIT = () => createSimpleInstr("ATEXIT", 0xedf3, 16);
export const ATEXITALT = () => createSimpleInstr("ATEXITALT", 0xedf4, 16);
export const SETEXITALT = () => createSimpleInstr("SETEXITALT", 0xedf5, 16);
export const THENRET = () => createSimpleInstr("THENRET", 0xedf6, 16);
export const THENRETALT = () => createSimpleInstr("THENRETALT", 0xedf7, 16);
export const INVERT = () => createSimpleInstr("INVERT", 0xedf8, 16);
export const BOOLEVAL = () => createSimpleInstr("BOOLEVAL", 0xedf9, 16);
export const SAMEALT = () => createSimpleInstr("SAMEALT", 0xedfa, 16);
export const SAMEALTSAVE = () => createSimpleInstr("SAMEALTSAVE", 0xedfb, 16);
export const TRY = () => createSimpleInstr("TRY", 0xf2ff, 16);
export const SETCPX = () => createSimpleInstr("SETCPX", 0xfff0, 16);
export const STDICT = () => createSimpleInstr("STDICT", 0xf400, 16);
export const SKIPDICT = () => createSimpleInstr("SKIPDICT", 0xf401, 16);
export const LDDICTS = () => createSimpleInstr("LDDICTS", 0xf402, 16);
export const PLDDICTS = () => createSimpleInstr("PLDDICTS", 0xf403, 16);
export const LDDICT = () => createSimpleInstr("LDDICT", 0xf404, 16);
export const PLDDICT = () => createSimpleInstr("PLDDICT", 0xf405, 16);
export const LDDICTQ = () => createSimpleInstr("LDDICTQ", 0xf406, 16);
export const PLDDICTQ = () => createSimpleInstr("PLDDICTQ", 0xf407, 16);
export const PFXDICTSET = () => createSimpleInstr("PFXDICTSET", 0xf470, 16);
export const PFXDICTREPLACE = () => createSimpleInstr("PFXDICTREPLACE", 0xf471, 16);
export const PFXDICTADD = () => createSimpleInstr("PFXDICTADD", 0xf472, 16);
export const PFXDICTDEL = () => createSimpleInstr("PFXDICTDEL", 0xf473, 16);
export const PFXDICTGETQ = () => createSimpleInstr("PFXDICTGETQ", 0xf4a8, 16);
export const PFXDICTGET = () => createSimpleInstr("PFXDICTGET", 0xf4a9, 16);
export const PFXDICTGETJMP = () => createSimpleInstr("PFXDICTGETJMP", 0xf4aa, 16);
export const PFXDICTGETEXEC = () => createSimpleInstr("PFXDICTGETEXEC", 0xf4ab, 16);
export const NOP = () => createSimpleInstr("NOP", 0x0, 8);
export const SWAP = () => createSimpleInstr("SWAP", 0x1, 8);
export const DUP = () => createSimpleInstr("DUP", 0x20, 8);
export const OVER = () => createSimpleInstr("OVER", 0x21, 8);
export const DROP = () => createSimpleInstr("DROP", 0x30, 8);
export const NIP = () => createSimpleInstr("NIP", 0x31, 8);
export const ROT = () => createSimpleInstr("ROT", 0x58, 8);
export const ROTREV = () => createSimpleInstr("ROTREV", 0x59, 8);
export const PICK = () => createSimpleInstr("PICK", 0x60, 8);
export const ROLL = () => createSimpleInstr("ROLL", 0x61, 8);
export const ROLLREV = () => createSimpleInstr("ROLLREV", 0x62, 8);
export const BLKSWX = () => createSimpleInstr("BLKSWX", 0x63, 8);
export const REVX = () => createSimpleInstr("REVX", 0x64, 8);
export const DROPX = () => createSimpleInstr("DROPX", 0x65, 8);
export const TUCK = () => createSimpleInstr("TUCK", 0x66, 8);
export const XCHGX = () => createSimpleInstr("XCHGX", 0x67, 8);
export const DEPTH = () => createSimpleInstr("DEPTH", 0x68, 8);
export const CHKDEPTH = () => createSimpleInstr("CHKDEPTH", 0x69, 8);
export const ONLYTOPX = () => createSimpleInstr("ONLYTOPX", 0x6a, 8);
export const ONLYX = () => createSimpleInstr("ONLYX", 0x6b, 8);
export const ACCEPT = () => createSimpleInstr("ACCEPT", 0xf800, 16);
export const SETGASLIMIT = () => createSimpleInstr("SETGASLIMIT", 0xf801, 16);
export const GASCONSUMED = () => createSimpleInstr("GASCONSUMED", 0xf807, 16);
export const COMMIT = () => createSimpleInstr("COMMIT", 0xf80f, 16);
export const NOW = () => createSimpleInstr("NOW", 0xf823, 16);
export const BLOCKLT = () => createSimpleInstr("BLOCKLT", 0xf824, 16);
export const LTIME = () => createSimpleInstr("LTIME", 0xf825, 16);
export const RANDSEED = () => createSimpleInstr("RANDSEED", 0xf826, 16);
export const BALANCE = () => createSimpleInstr("BALANCE", 0xf827, 16);
export const MYADDR = () => createSimpleInstr("MYADDR", 0xf828, 16);
export const CONFIGROOT = () => createSimpleInstr("CONFIGROOT", 0xf829, 16);
export const MYCODE = () => createSimpleInstr("MYCODE", 0xf82a, 16);
export const INCOMINGVALUE = () => createSimpleInstr("INCOMINGVALUE", 0xf82b, 16);
export const STORAGEFEES = () => createSimpleInstr("STORAGEFEES", 0xf82c, 16);
export const PREVBLOCKSINFOTUPLE = () => createSimpleInstr("PREVBLOCKSINFOTUPLE", 0xf82d, 16);
export const UNPACKEDCONFIGTUPLE = () => createSimpleInstr("UNPACKEDCONFIGTUPLE", 0xf82e, 16);
export const DUEPAYMENT = () => createSimpleInstr("DUEPAYMENT", 0xf82f, 16);
export const CONFIGDICT = () => createSimpleInstr("CONFIGDICT", 0xf830, 16);
export const CONFIGPARAM = () => createSimpleInstr("CONFIGPARAM", 0xf832, 16);
export const CONFIGOPTPARAM = () => createSimpleInstr("CONFIGOPTPARAM", 0xf833, 16);
export const PREVMCBLOCKS = () => createSimpleInstr("PREVMCBLOCKS", 0xf83400, 24);
export const PREVKEYBLOCK = () => createSimpleInstr("PREVKEYBLOCK", 0xf83401, 24);
export const PREVMCBLOCKS_100 = () => createSimpleInstr("PREVMCBLOCKS_100", 0xf83402, 24);
export const GLOBALID = () => createSimpleInstr("GLOBALID", 0xf835, 16);
export const GETGASFEE = () => createSimpleInstr("GETGASFEE", 0xf836, 16);
export const GETSTORAGEFEE = () => createSimpleInstr("GETSTORAGEFEE", 0xf837, 16);
export const GETFORWARDFEE = () => createSimpleInstr("GETFORWARDFEE", 0xf838, 16);
export const GETPRECOMPILEDGAS = () => createSimpleInstr("GETPRECOMPILEDGAS", 0xf839, 16);
export const GETORIGINALFWDFEE = () => createSimpleInstr("GETORIGINALFWDFEE", 0xf83a, 16);
export const GETGASFEESIMPLE = () => createSimpleInstr("GETGASFEESIMPLE", 0xf83b, 16);
export const GETFORWARDFEESIMPLE = () => createSimpleInstr("GETFORWARDFEESIMPLE", 0xf83c, 16);
export const GETGLOBVAR = () => createSimpleInstr("GETGLOBVAR", 0xf840, 16);
export const SETGLOBVAR = () => createSimpleInstr("SETGLOBVAR", 0xf860, 16);
export const RANDU256 = () => createSimpleInstr("RANDU256", 0xf810, 16);
export const RAND = () => createSimpleInstr("RAND", 0xf811, 16);
export const SETRAND = () => createSimpleInstr("SETRAND", 0xf814, 16);
export const ADDRAND = () => createSimpleInstr("ADDRAND", 0xf815, 16);
export const HASHCU = () => createSimpleInstr("HASHCU", 0xf900, 16);
export const HASHSU = () => createSimpleInstr("HASHSU", 0xf901, 16);
export const SHA256U = () => createSimpleInstr("SHA256U", 0xf902, 16);
export const CHKSIGNU = () => createSimpleInstr("CHKSIGNU", 0xf910, 16);
export const CHKSIGNS = () => createSimpleInstr("CHKSIGNS", 0xf911, 16);
export const ECRECOVER = () => createSimpleInstr("ECRECOVER", 0xf912, 16);
export const SECP256K1_XONLY_PUBKEY_TWEAK_ADD = () => createSimpleInstr("SECP256K1_XONLY_PUBKEY_TWEAK_ADD", 0xf913, 16);
export const P256_CHKSIGNU = () => createSimpleInstr("P256_CHKSIGNU", 0xf914, 16);
export const P256_CHKSIGNS = () => createSimpleInstr("P256_CHKSIGNS", 0xf915, 16);
export const RIST255_FROMHASH = () => createSimpleInstr("RIST255_FROMHASH", 0xf920, 16);
export const RIST255_VALIDATE = () => createSimpleInstr("RIST255_VALIDATE", 0xf921, 16);
export const RIST255_ADD = () => createSimpleInstr("RIST255_ADD", 0xf922, 16);
export const RIST255_SUB = () => createSimpleInstr("RIST255_SUB", 0xf923, 16);
export const RIST255_MUL = () => createSimpleInstr("RIST255_MUL", 0xf924, 16);
export const RIST255_MULBASE = () => createSimpleInstr("RIST255_MULBASE", 0xf925, 16);
export const RIST255_PUSHL = () => createSimpleInstr("RIST255_PUSHL", 0xf926, 16);
export const RIST255_QVALIDATE = () => createSimpleInstr("RIST255_QVALIDATE", 0xb7f921, 24);
export const RIST255_QADD = () => createSimpleInstr("RIST255_QADD", 0xb7f922, 24);
export const RIST255_QSUB = () => createSimpleInstr("RIST255_QSUB", 0xb7f923, 24);
export const RIST255_QMUL = () => createSimpleInstr("RIST255_QMUL", 0xb7f924, 24);
export const RIST255_QMULBASE = () => createSimpleInstr("RIST255_QMULBASE", 0xb7f925, 24);
export const BLS_VERIFY = () => createSimpleInstr("BLS_VERIFY", 0xf93000, 24);
export const BLS_AGGREGATE = () => createSimpleInstr("BLS_AGGREGATE", 0xf93001, 24);
export const BLS_FASTAGGREGATEVERIFY = () => createSimpleInstr("BLS_FASTAGGREGATEVERIFY", 0xf93002, 24);
export const BLS_AGGREGATEVERIFY = () => createSimpleInstr("BLS_AGGREGATEVERIFY", 0xf93003, 24);
export const BLS_G1_ADD = () => createSimpleInstr("BLS_G1_ADD", 0xf93010, 24);
export const BLS_G1_SUB = () => createSimpleInstr("BLS_G1_SUB", 0xf93011, 24);
export const BLS_G1_NEG = () => createSimpleInstr("BLS_G1_NEG", 0xf93012, 24);
export const BLS_G1_MUL = () => createSimpleInstr("BLS_G1_MUL", 0xf93013, 24);
export const BLS_G1_MULTIEXP = () => createSimpleInstr("BLS_G1_MULTIEXP", 0xf93014, 24);
export const BLS_G1_ZERO = () => createSimpleInstr("BLS_G1_ZERO", 0xf93015, 24);
export const BLS_MAP_TO_G1 = () => createSimpleInstr("BLS_MAP_TO_G1", 0xf93016, 24);
export const BLS_G1_INGROUP = () => createSimpleInstr("BLS_G1_INGROUP", 0xf93017, 24);
export const BLS_G1_ISZERO = () => createSimpleInstr("BLS_G1_ISZERO", 0xf93018, 24);
export const BLS_G2_ADD = () => createSimpleInstr("BLS_G2_ADD", 0xf93020, 24);
export const BLS_G2_SUB = () => createSimpleInstr("BLS_G2_SUB", 0xf93021, 24);
export const BLS_G2_NEG = () => createSimpleInstr("BLS_G2_NEG", 0xf93022, 24);
export const BLS_G2_MUL = () => createSimpleInstr("BLS_G2_MUL", 0xf93023, 24);
export const BLS_G2_MULTIEXP = () => createSimpleInstr("BLS_G2_MULTIEXP", 0xf93024, 24);
export const BLS_G2_ZERO = () => createSimpleInstr("BLS_G2_ZERO", 0xf93025, 24);
export const BLS_MAP_TO_G2 = () => createSimpleInstr("BLS_MAP_TO_G2", 0xf93026, 24);
export const BLS_G2_INGROUP = () => createSimpleInstr("BLS_G2_INGROUP", 0xf93027, 24);
export const BLS_G2_ISZERO = () => createSimpleInstr("BLS_G2_ISZERO", 0xf93028, 24);
export const BLS_PAIRING = () => createSimpleInstr("BLS_PAIRING", 0xf93030, 24);
export const BLS_PUSHR = () => createSimpleInstr("BLS_PUSHR", 0xf93031, 24);
export const CDATASIZEQ = () => createSimpleInstr("CDATASIZEQ", 0xf940, 16);
export const CDATASIZE = () => createSimpleInstr("CDATASIZE", 0xf941, 16);
export const SDATASIZEQ = () => createSimpleInstr("SDATASIZEQ", 0xf942, 16);
export const SDATASIZE = () => createSimpleInstr("SDATASIZE", 0xf943, 16);
export const LDGRAMS = () => createSimpleInstr("LDGRAMS", 0xfa00, 16);
export const LDVARINT16 = () => createSimpleInstr("LDVARINT16", 0xfa01, 16);
export const STGRAMS = () => createSimpleInstr("STGRAMS", 0xfa02, 16);
export const STVARINT16 = () => createSimpleInstr("STVARINT16", 0xfa03, 16);
export const LDVARUINT32 = () => createSimpleInstr("LDVARUINT32", 0xfa04, 16);
export const LDVARINT32 = () => createSimpleInstr("LDVARINT32", 0xfa05, 16);
export const STVARUINT32 = () => createSimpleInstr("STVARUINT32", 0xfa06, 16);
export const STVARINT32 = () => createSimpleInstr("STVARINT32", 0xfa07, 16);
export const LDMSGADDR = () => createSimpleInstr("LDMSGADDR", 0xfa40, 16);
export const LDMSGADDRQ = () => createSimpleInstr("LDMSGADDRQ", 0xfa41, 16);
export const PARSEMSGADDR = () => createSimpleInstr("PARSEMSGADDR", 0xfa42, 16);
export const PARSEMSGADDRQ = () => createSimpleInstr("PARSEMSGADDRQ", 0xfa43, 16);
export const REWRITESTDADDR = () => createSimpleInstr("REWRITESTDADDR", 0xfa44, 16);
export const REWRITESTDADDRQ = () => createSimpleInstr("REWRITESTDADDRQ", 0xfa45, 16);
export const REWRITEVARADDR = () => createSimpleInstr("REWRITEVARADDR", 0xfa46, 16);
export const REWRITEVARADDRQ = () => createSimpleInstr("REWRITEVARADDRQ", 0xfa47, 16);
export const SENDRAWMSG = () => createSimpleInstr("SENDRAWMSG", 0xfb00, 16);
export const RAWRESERVE = () => createSimpleInstr("RAWRESERVE", 0xfb02, 16);
export const RAWRESERVEX = () => createSimpleInstr("RAWRESERVEX", 0xfb03, 16);
export const SETCODE = () => createSimpleInstr("SETCODE", 0xfb04, 16);
export const SETLIBCODE = () => createSimpleInstr("SETLIBCODE", 0xfb06, 16);
export const CHANGELIB = () => createSimpleInstr("CHANGELIB", 0xfb07, 16);
export const SENDMSG = () => createSimpleInstr("SENDMSG", 0xfb08, 16);
export const PUSHNULL = () => createSimpleInstr("PUSHNULL", 0x6d, 8);
export const ISNULL = () => createSimpleInstr("ISNULL", 0x6e, 8);
export const TUPLEVAR = () => createSimpleInstr("TUPLEVAR", 0x6f80, 16);
export const INDEXVAR = () => createSimpleInstr("INDEXVAR", 0x6f81, 16);
export const UNTUPLEVAR = () => createSimpleInstr("UNTUPLEVAR", 0x6f82, 16);
export const UNPACKFIRSTVAR = () => createSimpleInstr("UNPACKFIRSTVAR", 0x6f83, 16);
export const EXPLODEVAR = () => createSimpleInstr("EXPLODEVAR", 0x6f84, 16);
export const SETINDEXVAR = () => createSimpleInstr("SETINDEXVAR", 0x6f85, 16);
export const INDEXVARQ = () => createSimpleInstr("INDEXVARQ", 0x6f86, 16);
export const SETINDEXVARQ = () => createSimpleInstr("SETINDEXVARQ", 0x6f87, 16);
export const TLEN = () => createSimpleInstr("TLEN", 0x6f88, 16);
export const QTLEN = () => createSimpleInstr("QTLEN", 0x6f89, 16);
export const ISTUPLE = () => createSimpleInstr("ISTUPLE", 0x6f8a, 16);
export const LAST = () => createSimpleInstr("LAST", 0x6f8b, 16);
export const TPUSH = () => createSimpleInstr("TPUSH", 0x6f8c, 16);
export const TPOP = () => createSimpleInstr("TPOP", 0x6f8d, 16);
export const NULLSWAPIF = () => createSimpleInstr("NULLSWAPIF", 0x6fa0, 16);
export const NULLSWAPIFNOT = () => createSimpleInstr("NULLSWAPIFNOT", 0x6fa1, 16);
export const NULLROTRIF = () => createSimpleInstr("NULLROTRIF", 0x6fa2, 16);
export const NULLROTRIFNOT = () => createSimpleInstr("NULLROTRIFNOT", 0x6fa3, 16);
export const NULLSWAPIF2 = () => createSimpleInstr("NULLSWAPIF2", 0x6fa4, 16);
export const NULLSWAPIFNOT2 = () => createSimpleInstr("NULLSWAPIFNOT2", 0x6fa5, 16);
export const NULLROTRIF2 = () => createSimpleInstr("NULLROTRIF2", 0x6fa6, 16);
export const NULLROTRIFNOT2 = () => createSimpleInstr("NULLROTRIFNOT2", 0x6fa7, 16);
export const ADDDIVMOD = () => createSimpleInstr("ADDDIVMOD", 0xa900, 16);
export const ADDDIVMODR = () => createSimpleInstr("ADDDIVMODR", 0xa901, 16);
export const ADDDIVMODC = () => createSimpleInstr("ADDDIVMODC", 0xa902, 16);
export const DIV = () => createSimpleInstr("DIV", 0xa904, 16);
export const DIVR = () => createSimpleInstr("DIVR", 0xa905, 16);
export const DIVC = () => createSimpleInstr("DIVC", 0xa906, 16);
export const MOD = () => createSimpleInstr("MOD", 0xa908, 16);
export const MODR = () => createSimpleInstr("MODR", 0xa909, 16);
export const MODC = () => createSimpleInstr("MODC", 0xa90a, 16);
export const DIVMOD = () => createSimpleInstr("DIVMOD", 0xa90c, 16);
export const DIVMODR = () => createSimpleInstr("DIVMODR", 0xa90d, 16);
export const DIVMODC = () => createSimpleInstr("DIVMODC", 0xa90e, 16);
export const QADDDIVMOD = () => createSimpleInstr("QADDDIVMOD", 0xb7a900, 24);
export const QADDDIVMODR = () => createSimpleInstr("QADDDIVMODR", 0xb7a901, 24);
export const QADDDIVMODC = () => createSimpleInstr("QADDDIVMODC", 0xb7a902, 24);
export const QDIV = () => createSimpleInstr("QDIV", 0xb7a904, 24);
export const QDIVR = () => createSimpleInstr("QDIVR", 0xb7a905, 24);
export const QDIVC = () => createSimpleInstr("QDIVC", 0xb7a906, 24);
export const QMOD = () => createSimpleInstr("QMOD", 0xb7a908, 24);
export const QMODR = () => createSimpleInstr("QMODR", 0xb7a909, 24);
export const QMODC = () => createSimpleInstr("QMODC", 0xb7a90a, 24);
export const QDIVMOD = () => createSimpleInstr("QDIVMOD", 0xb7a90c, 24);
export const QDIVMODR = () => createSimpleInstr("QDIVMODR", 0xb7a90d, 24);
export const QDIVMODC = () => createSimpleInstr("QDIVMODC", 0xb7a90e, 24);
export const ADDRSHIFTMOD = () => createSimpleInstr("ADDRSHIFTMOD", 0xa920, 16);
export const ADDRSHIFTMODR = () => createSimpleInstr("ADDRSHIFTMODR", 0xa921, 16);
export const ADDRSHIFTMODC = () => createSimpleInstr("ADDRSHIFTMODC", 0xa922, 16);
export const RSHIFTR = () => createSimpleInstr("RSHIFTR", 0xa925, 16);
export const RSHIFTC = () => createSimpleInstr("RSHIFTC", 0xa926, 16);
export const MODPOW2 = () => createSimpleInstr("MODPOW2", 0xa928, 16);
export const MODPOW2R = () => createSimpleInstr("MODPOW2R", 0xa929, 16);
export const MODPOW2C = () => createSimpleInstr("MODPOW2C", 0xa92a, 16);
export const RSHIFTMOD = () => createSimpleInstr("RSHIFTMOD", 0xa92c, 16);
export const RSHIFTMODR = () => createSimpleInstr("RSHIFTMODR", 0xa92d, 16);
export const RSHIFTMODC = () => createSimpleInstr("RSHIFTMODC", 0xa92e, 16);
export const QADDRSHIFTMOD = () => createSimpleInstr("QADDRSHIFTMOD", 0xb7a920, 24);
export const QADDRSHIFTMODR = () => createSimpleInstr("QADDRSHIFTMODR", 0xb7a921, 24);
export const QADDRSHIFTMODC = () => createSimpleInstr("QADDRSHIFTMODC", 0xb7a922, 24);
export const QRSHIFTR = () => createSimpleInstr("QRSHIFTR", 0xb7a925, 24);
export const QRSHIFTC = () => createSimpleInstr("QRSHIFTC", 0xb7a926, 24);
export const QMODPOW2 = () => createSimpleInstr("QMODPOW2", 0xb7a928, 24);
export const QMODPOW2R = () => createSimpleInstr("QMODPOW2R", 0xb7a929, 24);
export const QMODPOW2C = () => createSimpleInstr("QMODPOW2C", 0xb7a92a, 24);
export const QRSHIFTMOD = () => createSimpleInstr("QRSHIFTMOD", 0xb7a92c, 24);
export const QRSHIFTMODR = () => createSimpleInstr("QRSHIFTMODR", 0xb7a92d, 24);
export const QRSHIFTMODC = () => createSimpleInstr("QRSHIFTMODC", 0xb7a92e, 24);
export const MULADDDIVMOD = () => createSimpleInstr("MULADDDIVMOD", 0xa980, 16);
export const MULADDDIVMODR = () => createSimpleInstr("MULADDDIVMODR", 0xa981, 16);
export const MULADDDIVMODC = () => createSimpleInstr("MULADDDIVMODC", 0xa982, 16);
export const MULDIV = () => createSimpleInstr("MULDIV", 0xa984, 16);
export const MULDIVR = () => createSimpleInstr("MULDIVR", 0xa985, 16);
export const MULDIVC = () => createSimpleInstr("MULDIVC", 0xa986, 16);
export const MULMOD = () => createSimpleInstr("MULMOD", 0xa988, 16);
export const MULMODR = () => createSimpleInstr("MULMODR", 0xa989, 16);
export const MULMODC = () => createSimpleInstr("MULMODC", 0xa98a, 16);
export const MULDIVMOD = () => createSimpleInstr("MULDIVMOD", 0xa98c, 16);
export const MULDIVMODR = () => createSimpleInstr("MULDIVMODR", 0xa98d, 16);
export const MULDIVMODC = () => createSimpleInstr("MULDIVMODC", 0xa98e, 16);
export const QMULADDDIVMOD = () => createSimpleInstr("QMULADDDIVMOD", 0xb7a980, 24);
export const QMULADDDIVMODR = () => createSimpleInstr("QMULADDDIVMODR", 0xb7a981, 24);
export const QMULADDDIVMODC = () => createSimpleInstr("QMULADDDIVMODC", 0xb7a982, 24);
export const QMULDIV = () => createSimpleInstr("QMULDIV", 0xb7a984, 24);
export const QMULDIVR = () => createSimpleInstr("QMULDIVR", 0xb7a985, 24);
export const QMULDIVC = () => createSimpleInstr("QMULDIVC", 0xb7a986, 24);
export const QMULMOD = () => createSimpleInstr("QMULMOD", 0xb7a988, 24);
export const QMULMODR = () => createSimpleInstr("QMULMODR", 0xb7a989, 24);
export const QMULMODC = () => createSimpleInstr("QMULMODC", 0xb7a98a, 24);
export const QMULDIVMOD = () => createSimpleInstr("QMULDIVMOD", 0xb7a98c, 24);
export const QMULDIVMODR = () => createSimpleInstr("QMULDIVMODR", 0xb7a98d, 24);
export const QMULDIVMODC = () => createSimpleInstr("QMULDIVMODC", 0xb7a98e, 24);
export const MULADDRSHIFTMOD = () => createSimpleInstr("MULADDRSHIFTMOD", 0xa9a0, 16);
export const MULADDRSHIFTRMOD = () => createSimpleInstr("MULADDRSHIFTRMOD", 0xa9a1, 16);
export const MULADDRSHIFTCMOD = () => createSimpleInstr("MULADDRSHIFTCMOD", 0xa9a2, 16);
export const MULRSHIFT = () => createSimpleInstr("MULRSHIFT", 0xa9a4, 16);
export const MULRSHIFTR = () => createSimpleInstr("MULRSHIFTR", 0xa9a5, 16);
export const MULRSHIFTC = () => createSimpleInstr("MULRSHIFTC", 0xa9a6, 16);
export const MULMODPOW2 = () => createSimpleInstr("MULMODPOW2", 0xa9a8, 16);
export const MULMODPOW2R = () => createSimpleInstr("MULMODPOW2R", 0xa9a9, 16);
export const MULMODPOW2C = () => createSimpleInstr("MULMODPOW2C", 0xa9aa, 16);
export const MULRSHIFTMOD = () => createSimpleInstr("MULRSHIFTMOD", 0xa9ac, 16);
export const MULRSHIFTRMOD = () => createSimpleInstr("MULRSHIFTRMOD", 0xa9ad, 16);
export const MULRSHIFTCMOD = () => createSimpleInstr("MULRSHIFTCMOD", 0xa9ae, 16);
export const QMULADDRSHIFTMOD = () => createSimpleInstr("QMULADDRSHIFTMOD", 0xb7a9a0, 24);
export const QMULADDRSHIFTRMOD = () => createSimpleInstr("QMULADDRSHIFTRMOD", 0xb7a9a1, 24);
export const QMULADDRSHIFTCMOD = () => createSimpleInstr("QMULADDRSHIFTCMOD", 0xb7a9a2, 24);
export const QMULRSHIFT = () => createSimpleInstr("QMULRSHIFT", 0xb7a9a4, 24);
export const QMULRSHIFTR = () => createSimpleInstr("QMULRSHIFTR", 0xb7a9a5, 24);
export const QMULRSHIFTC = () => createSimpleInstr("QMULRSHIFTC", 0xb7a9a6, 24);
export const QMULMODPOW2 = () => createSimpleInstr("QMULMODPOW2", 0xb7a9a8, 24);
export const QMULMODPOW2R = () => createSimpleInstr("QMULMODPOW2R", 0xb7a9a9, 24);
export const QMULMODPOW2C = () => createSimpleInstr("QMULMODPOW2C", 0xb7a9aa, 24);
export const QMULRSHIFTMOD = () => createSimpleInstr("QMULRSHIFTMOD", 0xb7a9ac, 24);
export const QMULRSHIFTRMOD = () => createSimpleInstr("QMULRSHIFTRMOD", 0xb7a9ad, 24);
export const QMULRSHIFTCMOD = () => createSimpleInstr("QMULRSHIFTCMOD", 0xb7a9ae, 24);
export const LSHIFTADDDIVMOD = () => createSimpleInstr("LSHIFTADDDIVMOD", 0xa9c0, 16);
export const LSHIFTADDDIVMODR = () => createSimpleInstr("LSHIFTADDDIVMODR", 0xa9c1, 16);
export const LSHIFTADDDIVMODC = () => createSimpleInstr("LSHIFTADDDIVMODC", 0xa9c2, 16);
export const LSHIFTDIV = () => createSimpleInstr("LSHIFTDIV", 0xa9c4, 16);
export const LSHIFTDIVR = () => createSimpleInstr("LSHIFTDIVR", 0xa9c5, 16);
export const LSHIFTDIVC = () => createSimpleInstr("LSHIFTDIVC", 0xa9c6, 16);
export const LSHIFTMOD = () => createSimpleInstr("LSHIFTMOD", 0xa9c8, 16);
export const LSHIFTMODR = () => createSimpleInstr("LSHIFTMODR", 0xa9c9, 16);
export const LSHIFTMODC = () => createSimpleInstr("LSHIFTMODC", 0xa9ca, 16);
export const LSHIFTDIVMOD = () => createSimpleInstr("LSHIFTDIVMOD", 0xa9cc, 16);
export const LSHIFTDIVMODR = () => createSimpleInstr("LSHIFTDIVMODR", 0xa9cd, 16);
export const LSHIFTDIVMODC = () => createSimpleInstr("LSHIFTDIVMODC", 0xa9ce, 16);
export const QLSHIFTADDDIVMOD = () => createSimpleInstr("QLSHIFTADDDIVMOD", 0xb7a9c0, 24);
export const QLSHIFTADDDIVMODR = () => createSimpleInstr("QLSHIFTADDDIVMODR", 0xb7a9c1, 24);
export const QLSHIFTADDDIVMODC = () => createSimpleInstr("QLSHIFTADDDIVMODC", 0xb7a9c2, 24);
export const QLSHIFTDIV = () => createSimpleInstr("QLSHIFTDIV", 0xb7a9c4, 24);
export const QLSHIFTDIVR = () => createSimpleInstr("QLSHIFTDIVR", 0xb7a9c5, 24);
export const QLSHIFTDIVC = () => createSimpleInstr("QLSHIFTDIVC", 0xb7a9c6, 24);
export const QLSHIFTMOD = () => createSimpleInstr("QLSHIFTMOD", 0xb7a9c8, 24);
export const QLSHIFTMODR = () => createSimpleInstr("QLSHIFTMODR", 0xb7a9c9, 24);
export const QLSHIFTMODC = () => createSimpleInstr("QLSHIFTMODC", 0xb7a9ca, 24);
export const QLSHIFTDIVMOD = () => createSimpleInstr("QLSHIFTDIVMOD", 0xb7a9cc, 24);
export const QLSHIFTDIVMODR = () => createSimpleInstr("QLSHIFTDIVMODR", 0xb7a9cd, 24);
export const QLSHIFTDIVMODC = () => createSimpleInstr("QLSHIFTDIVMODC", 0xb7a9ce, 24);
export const STIX = () => createSimpleInstr("STIX", 0xcf00, 16);
export const STUX = () => createSimpleInstr("STUX", 0xcf01, 16);
export const STIXR = () => createSimpleInstr("STIXR", 0xcf02, 16);
export const STUXR = () => createSimpleInstr("STUXR", 0xcf03, 16);
export const STIXQ = () => createSimpleInstr("STIXQ", 0xcf04, 16);
export const STUXQ = () => createSimpleInstr("STUXQ", 0xcf05, 16);
export const STIXRQ = () => createSimpleInstr("STIXRQ", 0xcf06, 16);
export const STUXRQ = () => createSimpleInstr("STUXRQ", 0xcf07, 16);
export const STILE4 = () => createSimpleInstr("STILE4", 0xcf28, 16);
export const STULE4 = () => createSimpleInstr("STULE4", 0xcf29, 16);
export const STILE8 = () => createSimpleInstr("STILE8", 0xcf2a, 16);
export const STULE8 = () => createSimpleInstr("STULE8", 0xcf2b, 16);
export const LDIX = () => createSimpleInstr("LDIX", 0xd700, 16);
export const LDUX = () => createSimpleInstr("LDUX", 0xd701, 16);
export const PLDIX = () => createSimpleInstr("PLDIX", 0xd702, 16);
export const PLDUX = () => createSimpleInstr("PLDUX", 0xd703, 16);
export const LDIXQ = () => createSimpleInstr("LDIXQ", 0xd704, 16);
export const LDUXQ = () => createSimpleInstr("LDUXQ", 0xd705, 16);
export const PLDIXQ = () => createSimpleInstr("PLDIXQ", 0xd706, 16);
export const PLDUXQ = () => createSimpleInstr("PLDUXQ", 0xd707, 16);
export const LDSLICEX = () => createSimpleInstr("LDSLICEX", 0xd718, 16);
export const PLDSLICEX = () => createSimpleInstr("PLDSLICEX", 0xd719, 16);
export const LDSLICEXQ = () => createSimpleInstr("LDSLICEXQ", 0xd71a, 16);
export const PLDSLICEXQ = () => createSimpleInstr("PLDSLICEXQ", 0xd71b, 16);
export const LDILE4 = () => createSimpleInstr("LDILE4", 0xd750, 16);
export const LDULE4 = () => createSimpleInstr("LDULE4", 0xd751, 16);
export const LDILE8 = () => createSimpleInstr("LDILE8", 0xd752, 16);
export const LDULE8 = () => createSimpleInstr("LDULE8", 0xd753, 16);
export const PLDILE4 = () => createSimpleInstr("PLDILE4", 0xd754, 16);
export const PLDULE4 = () => createSimpleInstr("PLDULE4", 0xd755, 16);
export const PLDILE8 = () => createSimpleInstr("PLDILE8", 0xd756, 16);
export const PLDULE8 = () => createSimpleInstr("PLDULE8", 0xd757, 16);
export const LDILE4Q = () => createSimpleInstr("LDILE4Q", 0xd758, 16);
export const LDULE4Q = () => createSimpleInstr("LDULE4Q", 0xd759, 16);
export const LDILE8Q = () => createSimpleInstr("LDILE8Q", 0xd75a, 16);
export const LDULE8Q = () => createSimpleInstr("LDULE8Q", 0xd75b, 16);
export const PLDILE4Q = () => createSimpleInstr("PLDILE4Q", 0xd75c, 16);
export const PLDULE4Q = () => createSimpleInstr("PLDULE4Q", 0xd75d, 16);
export const PLDILE8Q = () => createSimpleInstr("PLDILE8Q", 0xd75e, 16);
export const PLDULE8Q = () => createSimpleInstr("PLDULE8Q", 0xd75f, 16);
export const DICTIGETJMP = () => createSimpleInstr("DICTIGETJMP", 0xf4a0, 16);
export const DICTUGETJMP = () => createSimpleInstr("DICTUGETJMP", 0xf4a1, 16);
export const DICTIGETEXEC = () => createSimpleInstr("DICTIGETEXEC", 0xf4a2, 16);
export const DICTUGETEXEC = () => createSimpleInstr("DICTUGETEXEC", 0xf4a3, 16);
export const DICTIGETJMPZ = () => createSimpleInstr("DICTIGETJMPZ", 0xf4bc, 16);
export const DICTUGETJMPZ = () => createSimpleInstr("DICTUGETJMPZ", 0xf4bd, 16);
export const DICTIGETEXECZ = () => createSimpleInstr("DICTIGETEXECZ", 0xf4be, 16);
export const DICTUGETEXECZ = () => createSimpleInstr("DICTUGETEXECZ", 0xf4bf, 16);
export const DICTGET = () => createSimpleInstr("DICTGET", 0xf40a, 16);
export const DICTGETREF = () => createSimpleInstr("DICTGETREF", 0xf40b, 16);
export const DICTIGET = () => createSimpleInstr("DICTIGET", 0xf40c, 16);
export const DICTIGETREF = () => createSimpleInstr("DICTIGETREF", 0xf40d, 16);
export const DICTUGET = () => createSimpleInstr("DICTUGET", 0xf40e, 16);
export const DICTUGETREF = () => createSimpleInstr("DICTUGETREF", 0xf40f, 16);
export const DICTSET = () => createSimpleInstr("DICTSET", 0xf412, 16);
export const DICTSETREF = () => createSimpleInstr("DICTSETREF", 0xf413, 16);
export const DICTISET = () => createSimpleInstr("DICTISET", 0xf414, 16);
export const DICTISETREF = () => createSimpleInstr("DICTISETREF", 0xf415, 16);
export const DICTUSET = () => createSimpleInstr("DICTUSET", 0xf416, 16);
export const DICTUSETREF = () => createSimpleInstr("DICTUSETREF", 0xf417, 16);
export const DICTSETGET = () => createSimpleInstr("DICTSETGET", 0xf41a, 16);
export const DICTSETGETREF = () => createSimpleInstr("DICTSETGETREF", 0xf41b, 16);
export const DICTISETGET = () => createSimpleInstr("DICTISETGET", 0xf41c, 16);
export const DICTISETGETREF = () => createSimpleInstr("DICTISETGETREF", 0xf41d, 16);
export const DICTUSETGET = () => createSimpleInstr("DICTUSETGET", 0xf41e, 16);
export const DICTUSETGETREF = () => createSimpleInstr("DICTUSETGETREF", 0xf41f, 16);
export const DICTREPLACE = () => createSimpleInstr("DICTREPLACE", 0xf422, 16);
export const DICTREPLACEREF = () => createSimpleInstr("DICTREPLACEREF", 0xf423, 16);
export const DICTIREPLACE = () => createSimpleInstr("DICTIREPLACE", 0xf424, 16);
export const DICTIREPLACEREF = () => createSimpleInstr("DICTIREPLACEREF", 0xf425, 16);
export const DICTUREPLACE = () => createSimpleInstr("DICTUREPLACE", 0xf426, 16);
export const DICTUREPLACEREF = () => createSimpleInstr("DICTUREPLACEREF", 0xf427, 16);
export const DICTREPLACEGET = () => createSimpleInstr("DICTREPLACEGET", 0xf42a, 16);
export const DICTREPLACEGETREF = () => createSimpleInstr("DICTREPLACEGETREF", 0xf42b, 16);
export const DICTIREPLACEGET = () => createSimpleInstr("DICTIREPLACEGET", 0xf42c, 16);
export const DICTIREPLACEGETREF = () => createSimpleInstr("DICTIREPLACEGETREF", 0xf42d, 16);
export const DICTUREPLACEGET = () => createSimpleInstr("DICTUREPLACEGET", 0xf42e, 16);
export const DICTUREPLACEGETREF = () => createSimpleInstr("DICTUREPLACEGETREF", 0xf42f, 16);
export const DICTADD = () => createSimpleInstr("DICTADD", 0xf432, 16);
export const DICTADDREF = () => createSimpleInstr("DICTADDREF", 0xf433, 16);
export const DICTIADD = () => createSimpleInstr("DICTIADD", 0xf434, 16);
export const DICTIADDREF = () => createSimpleInstr("DICTIADDREF", 0xf435, 16);
export const DICTUADD = () => createSimpleInstr("DICTUADD", 0xf436, 16);
export const DICTUADDREF = () => createSimpleInstr("DICTUADDREF", 0xf437, 16);
export const DICTADDGET = () => createSimpleInstr("DICTADDGET", 0xf43a, 16);
export const DICTADDGETREF = () => createSimpleInstr("DICTADDGETREF", 0xf43b, 16);
export const DICTIADDGET = () => createSimpleInstr("DICTIADDGET", 0xf43c, 16);
export const DICTIADDGETREF = () => createSimpleInstr("DICTIADDGETREF", 0xf43d, 16);
export const DICTUADDGET = () => createSimpleInstr("DICTUADDGET", 0xf43e, 16);
export const DICTUADDGETREF = () => createSimpleInstr("DICTUADDGETREF", 0xf43f, 16);
export const DICTDELGET = () => createSimpleInstr("DICTDELGET", 0xf462, 16);
export const DICTDELGETREF = () => createSimpleInstr("DICTDELGETREF", 0xf463, 16);
export const DICTIDELGET = () => createSimpleInstr("DICTIDELGET", 0xf464, 16);
export const DICTIDELGETREF = () => createSimpleInstr("DICTIDELGETREF", 0xf465, 16);
export const DICTUDELGET = () => createSimpleInstr("DICTUDELGET", 0xf466, 16);
export const DICTUDELGETREF = () => createSimpleInstr("DICTUDELGETREF", 0xf467, 16);
export const DICTMIN = () => createSimpleInstr("DICTMIN", 0xf482, 16);
export const DICTMINREF = () => createSimpleInstr("DICTMINREF", 0xf483, 16);
export const DICTIMIN = () => createSimpleInstr("DICTIMIN", 0xf484, 16);
export const DICTIMINREF = () => createSimpleInstr("DICTIMINREF", 0xf485, 16);
export const DICTUMIN = () => createSimpleInstr("DICTUMIN", 0xf486, 16);
export const DICTUMINREF = () => createSimpleInstr("DICTUMINREF", 0xf487, 16);
export const DICTMAX = () => createSimpleInstr("DICTMAX", 0xf48a, 16);
export const DICTMAXREF = () => createSimpleInstr("DICTMAXREF", 0xf48b, 16);
export const DICTIMAX = () => createSimpleInstr("DICTIMAX", 0xf48c, 16);
export const DICTIMAXREF = () => createSimpleInstr("DICTIMAXREF", 0xf48d, 16);
export const DICTUMAX = () => createSimpleInstr("DICTUMAX", 0xf48e, 16);
export const DICTUMAXREF = () => createSimpleInstr("DICTUMAXREF", 0xf48f, 16);
export const DICTREMMIN = () => createSimpleInstr("DICTREMMIN", 0xf492, 16);
export const DICTREMMINREF = () => createSimpleInstr("DICTREMMINREF", 0xf493, 16);
export const DICTIREMMIN = () => createSimpleInstr("DICTIREMMIN", 0xf494, 16);
export const DICTIREMMINREF = () => createSimpleInstr("DICTIREMMINREF", 0xf495, 16);
export const DICTUREMMIN = () => createSimpleInstr("DICTUREMMIN", 0xf496, 16);
export const DICTUREMMINREF = () => createSimpleInstr("DICTUREMMINREF", 0xf497, 16);
export const DICTREMMAX = () => createSimpleInstr("DICTREMMAX", 0xf49a, 16);
export const DICTREMMAXREF = () => createSimpleInstr("DICTREMMAXREF", 0xf49b, 16);
export const DICTIREMMAX = () => createSimpleInstr("DICTIREMMAX", 0xf49c, 16);
export const DICTIREMMAXREF = () => createSimpleInstr("DICTIREMMAXREF", 0xf49d, 16);
export const DICTUREMMAX = () => createSimpleInstr("DICTUREMMAX", 0xf49e, 16);
export const DICTUREMMAXREF = () => createSimpleInstr("DICTUREMMAXREF", 0xf49f, 16);
export const DICTSETB = () => createSimpleInstr("DICTSETB", 0xf441, 16);
export const DICTISETB = () => createSimpleInstr("DICTISETB", 0xf442, 16);
export const DICTUSETB = () => createSimpleInstr("DICTUSETB", 0xf443, 16);
export const DICTSETGETB = () => createSimpleInstr("DICTSETGETB", 0xf445, 16);
export const DICTISETGETB = () => createSimpleInstr("DICTISETGETB", 0xf446, 16);
export const DICTUSETGETB = () => createSimpleInstr("DICTUSETGETB", 0xf447, 16);
export const DICTREPLACEB = () => createSimpleInstr("DICTREPLACEB", 0xf449, 16);
export const DICTIREPLACEB = () => createSimpleInstr("DICTIREPLACEB", 0xf44a, 16);
export const DICTUREPLACEB = () => createSimpleInstr("DICTUREPLACEB", 0xf44b, 16);
export const DICTREPLACEGETB = () => createSimpleInstr("DICTREPLACEGETB", 0xf44d, 16);
export const DICTIREPLACEGETB = () => createSimpleInstr("DICTIREPLACEGETB", 0xf44e, 16);
export const DICTUREPLACEGETB = () => createSimpleInstr("DICTUREPLACEGETB", 0xf44f, 16);
export const DICTADDB = () => createSimpleInstr("DICTADDB", 0xf451, 16);
export const DICTIADDB = () => createSimpleInstr("DICTIADDB", 0xf452, 16);
export const DICTUADDB = () => createSimpleInstr("DICTUADDB", 0xf453, 16);
export const DICTADDGETB = () => createSimpleInstr("DICTADDGETB", 0xf455, 16);
export const DICTIADDGETB = () => createSimpleInstr("DICTIADDGETB", 0xf456, 16);
export const DICTUADDGETB = () => createSimpleInstr("DICTUADDGETB", 0xf457, 16);
export const DICTDEL = () => createSimpleInstr("DICTDEL", 0xf459, 16);
export const DICTIDEL = () => createSimpleInstr("DICTIDEL", 0xf45a, 16);
export const DICTUDEL = () => createSimpleInstr("DICTUDEL", 0xf45b, 16);
export const DICTGETOPTREF = () => createSimpleInstr("DICTGETOPTREF", 0xf469, 16);
export const DICTIGETOPTREF = () => createSimpleInstr("DICTIGETOPTREF", 0xf46a, 16);
export const DICTUGETOPTREF = () => createSimpleInstr("DICTUGETOPTREF", 0xf46b, 16);
export const DICTSETGETOPTREF = () => createSimpleInstr("DICTSETGETOPTREF", 0xf46d, 16);
export const DICTISETGETOPTREF = () => createSimpleInstr("DICTISETGETOPTREF", 0xf46e, 16);
export const DICTUSETGETOPTREF = () => createSimpleInstr("DICTUSETGETOPTREF", 0xf46f, 16);
export const SUBDICTGET = () => createSimpleInstr("SUBDICTGET", 0xf4b1, 16);
export const SUBDICTIGET = () => createSimpleInstr("SUBDICTIGET", 0xf4b2, 16);
export const SUBDICTUGET = () => createSimpleInstr("SUBDICTUGET", 0xf4b3, 16);
export const SUBDICTRPGET = () => createSimpleInstr("SUBDICTRPGET", 0xf4b5, 16);
export const SUBDICTIRPGET = () => createSimpleInstr("SUBDICTIRPGET", 0xf4b6, 16);
export const SUBDICTURPGET = () => createSimpleInstr("SUBDICTURPGET", 0xf4b7, 16);
export const THROWANY = () => createSimpleInstr("THROWANY", 0xf2f0, 16);
export const THROWARGANY = () => createSimpleInstr("THROWARGANY", 0xf2f1, 16);
export const THROWANYIFNOT = () => createSimpleInstr("THROWANYIFNOT", 0xf2f4, 16);
export const THROWARGANYIFNOT = () => createSimpleInstr("THROWARGANYIFNOT", 0xf2f5, 16);
export const DICTGETNEXT = () => createSimpleInstr("DICTGETNEXT", 0xf474, 16);
export const DICTGETNEXTEQ = () => createSimpleInstr("DICTGETNEXTEQ", 0xf475, 16);
export const DICTGETPREV = () => createSimpleInstr("DICTGETPREV", 0xf476, 16);
export const DICTGETPREVEQ = () => createSimpleInstr("DICTGETPREVEQ", 0xf477, 16);
export const DICTIGETNEXT = () => createSimpleInstr("DICTIGETNEXT", 0xf478, 16);
export const DICTIGETNEXTEQ = () => createSimpleInstr("DICTIGETNEXTEQ", 0xf479, 16);
export const DICTIGETPREV = () => createSimpleInstr("DICTIGETPREV", 0xf47a, 16);
export const DICTIGETPREVEQ = () => createSimpleInstr("DICTIGETPREVEQ", 0xf47b, 16);
export const DICTUGETNEXT = () => createSimpleInstr("DICTUGETNEXT", 0xf47c, 16);
export const DICTUGETNEXTEQ = () => createSimpleInstr("DICTUGETNEXTEQ", 0xf47d, 16);
export const DICTUGETPREV = () => createSimpleInstr("DICTUGETPREV", 0xf47e, 16);
export const DICTUGETPREVEQ = () => createSimpleInstr("DICTUGETPREVEQ", 0xf47f, 16);
export const ADDINT = createUnaryInstr(0xa6, 8, int(8))
export const MULINT = createUnaryInstr(0xa7, 8, int(8))
export const QADDINT = createUnaryInstr(0xb7a6, 16, int(8))
export const QMULINT = createUnaryInstr(0xb7a7, 16, int(8))
export const EQINT = createUnaryInstr(0xc0, 8, int(8))
export const LESSINT = createUnaryInstr(0xc1, 8, int(8))
export const GTINT = createUnaryInstr(0xc2, 8, int(8))
export const NEQINT = createUnaryInstr(0xc3, 8, int(8))
export const QEQINT = createUnaryInstr(0xb7c0, 16, int(8))
export const QLESSINT = createUnaryInstr(0xb7c1, 16, int(8))
export const QGTINT = createUnaryInstr(0xb7c2, 16, int(8))
export const QNEQINT = createUnaryInstr(0xb7c3, 16, int(8))
export const PUSHPOW2DEC = createUnaryInstr(0x84, 8, delta(1, uint(8)))
export const PUSHNEGPOW2 = createUnaryInstr(0x85, 8, delta(1, uint(8)))
export const FITS = createUnaryInstr(0xb4, 8, delta(1, uint(8)))
export const UFITS = createUnaryInstr(0xb5, 8, delta(1, uint(8)))
export const QFITS = createUnaryInstr(0xb7b4, 16, delta(1, uint(8)))
export const QUFITS = createUnaryInstr(0xb7b5, 16, delta(1, uint(8)))
export const SETCONTCTRMANY = createUnaryInstr(0xede3, 16, delta(1, uint(8)))
export const CALLCCARGS = createBinaryInstr(0xdb36, 16, uint(4), uint(4))
export const TRYARGS = createBinaryInstr(0xf3, 8, uint(4), uint(4))
export const PLDREFIDX = createUnaryInstr(0x35d3, 14, uint(2))
export const CHASHI = createUnaryInstr(0x35da, 14, uint(2))
export const CDEPTHI = createUnaryInstr(0x35db, 14, uint(2))
export const JMPDICT = createUnaryInstr(0x3c5, 10, uint(14))
export const PREPAREDICT = createUnaryInstr(0x3c6, 10, uint(14))
export const THROWARG = createUnaryInstr(0x1e59, 13, uint(11))
export const THROWARGIF = createUnaryInstr(0x1e5b, 13, uint(11))
export const THROWARGIFNOT = createUnaryInstr(0x1e5d, 13, uint(11))
export const JMPXARGS = createUnaryInstr(0xdb1, 12, uint(4))
export const RETARGS = createUnaryInstr(0xdb2, 12, uint(4))
export const RETURNARGS = createUnaryInstr(0xed0, 12, uint(4))
export const BLKDROP = createUnaryInstr(0x5f0, 12, uint(4))
export const TUPLE = createUnaryInstr(0x6f0, 12, uint(4))
export const INDEX = createUnaryInstr(0x6f1, 12, uint(4))
export const UNTUPLE = createUnaryInstr(0x6f2, 12, uint(4))
export const UNPACKFIRST = createUnaryInstr(0x6f3, 12, uint(4))
export const EXPLODE = createUnaryInstr(0x6f4, 12, uint(4))
export const SETINDEX = createUnaryInstr(0x6f5, 12, uint(4))
export const INDEXQ = createUnaryInstr(0x6f6, 12, uint(4))
export const SETINDEXQ = createUnaryInstr(0x6f7, 12, uint(4))
export const XC2PU = createTernaryInstr(0x541, 12, uint(4), uint(4), uint(4))
export const XCPU2 = createTernaryInstr(0x543, 12, uint(4), uint(4), uint(4))
export const PUSH3 = createTernaryInstr(0x547, 12, uint(4), uint(4), uint(4))
export const XCHG2 = createBinaryInstr(0x50, 8, uint(4), uint(4))
export const XCPU = createBinaryInstr(0x51, 8, uint(4), uint(4))
export const PUSH2 = createBinaryInstr(0x53, 8, uint(4), uint(4))
export const PUXC = createBinaryInstr(0x52, 8, uint(4), delta(-1, uint(4)))
export const XCPUXC = createTernaryInstr(0x542, 12, uint(4), uint(4), delta(-1, uint(4)))
export const PUXC2 = createTernaryInstr(0x544, 12, uint(4), delta(-1, uint(4)), delta(-1, uint(4)))
export const PUXCPU = createTernaryInstr(0x545, 12, uint(4), delta(-1, uint(4)), delta(-1, uint(4)))
export const PU2XC = createTernaryInstr(0x546, 12, uint(4), delta(-1, uint(4)), delta(-2, uint(4)))
export const BLKSWAP = createBinaryInstr(0x55, 8, delta(1, uint(4)), delta(1, uint(4)))
export const REVERSE = createBinaryInstr(0x5e, 8, delta(2, uint(4)), uint(4))
export const SETCONTARGS = createBinaryInstr(0xec, 8, uint(4), delta(-1, uint(4)))
export const BLESSARGS = createBinaryInstr(0xee, 8, uint(4), delta(-1, uint(4)))
export const STIR = createUnaryInstr(0xcf0a, 16, delta(1, uint(8)))
export const STUR = createUnaryInstr(0xcf0b, 16, delta(1, uint(8)))
export const STIQ = createUnaryInstr(0xcf0c, 16, delta(1, uint(8)))
export const STUQ = createUnaryInstr(0xcf0d, 16, delta(1, uint(8)))
export const STIRQ = createUnaryInstr(0xcf0e, 16, delta(1, uint(8)))
export const STURQ = createUnaryInstr(0xcf0f, 16, delta(1, uint(8)))
export const PLDI = createUnaryInstr(0xd70a, 16, delta(1, uint(8)))
export const PLDU = createUnaryInstr(0xd70b, 16, delta(1, uint(8)))
export const LDIQ = createUnaryInstr(0xd70c, 16, delta(1, uint(8)))
export const LDUQ = createUnaryInstr(0xd70d, 16, delta(1, uint(8)))
export const PLDIQ = createUnaryInstr(0xd70e, 16, delta(1, uint(8)))
export const PLDUQ = createUnaryInstr(0xd70f, 16, delta(1, uint(8)))
export const PLDUZ = createUnaryInstr(0x1ae2, 13, plduzArg)
export const PLDSLICE = createUnaryInstr(0xd71d, 16, delta(1, uint(8)))
export const LDSLICEQ = createUnaryInstr(0xd71e, 16, delta(1, uint(8)))
export const PLDSLICEQ = createUnaryInstr(0xd71f, 16, delta(1, uint(8)))
export const IFBITJMP = createUnaryInstr(0x71c, 11, uint(5))
export const IFNBITJMP = createUnaryInstr(0x71d, 11, uint(5))
export const INDEX2 = createBinaryInstr(0x6fb, 12, uint(2), uint(2))
export const INDEX3 = createTernaryInstr(0x1bf, 10, uint(2), uint(2), uint(2))
export const PUSHPOW2 = createFixedRangeInstr(0x8300, 8, 8, delta(1, uint(8)))
export const BLKPUSH = createFixedRangeInstr(0x5f10, 8, 8, seq2(uint(4), uint(4)))
export const BLKDROP2 = createFixedRangeInstr(0x6c10, 8, 8, seq2(uint(4), uint(4)))
export const GETGLOB = createFixedRangeInstr(0xf841, 11, 5, uint(5))
export const SETGLOB = createFixedRangeInstr(0xf861, 11, 5, uint(5))
export const GETPARAM = createFixedRangeInstr(0xf820, 12, 4, uint(4))
export const SDBEGINSX = () => createSimpleInstr("SDBEGINSX", 0xd726, 16);
export const SDBEGINSXQ = () => createSimpleInstr("SDBEGINSXQ", 0xd727, 16);
export const THROWANYIF = () => createSimpleInstr("THROWANYIF", 0xf2f2, 16);
export const THROWARGANYIF = () => createSimpleInstr("THROWARGANYIF", 0xf2f3, 16);
export const SETCONTCTR = createFixedRangeInstr(0xed60, 12, 4, control)
export const SETRETCTR = createFixedRangeInstr(0xed70, 12, 4, control)
export const SETALTCTR = createFixedRangeInstr(0xed80, 12, 4, control)
export const POPSAVE = createFixedRangeInstr(0xed90, 12, 4, control)
export const SAVECTR = createFixedRangeInstr(0xeda0, 12, 4, control)
export const SAVEALTCTR = createFixedRangeInstr(0xedb0, 12, 4, control)
export const SAVEBOTHCTR = createFixedRangeInstr(0xedc0, 12, 4, control)
export const RUNVM = createUnaryInstr(0xdb4, 12, uint(12))
export const SWAP2 = () => createSimpleInstr("2SWAP", 0x5a, 8);
export const DROP2 = () => createSimpleInstr("2DROP", 0x5b, 8);
export const DUP2 = () => createSimpleInstr("2DUP", 0x5c, 8);
export const OVER2 = () => createSimpleInstr("2OVER", 0x5d, 8);
export const ADDRSHIFT_MOD = createUnaryInstr(0xa930, 16, delta(1, uint(8)))
export const ADDRSHIFTR_MOD = createUnaryInstr(0xa931, 16, delta(1, uint(8)))
export const ADDRSHIFTC_MOD = createUnaryInstr(0xa932, 16, delta(1, uint(8)))
export const RSHIFT_ = createUnaryInstr(0xa934, 16, delta(1, uint(8)))
export const RSHIFTR_ = createUnaryInstr(0xa935, 16, delta(1, uint(8)))
export const RSHIFTC_ = createUnaryInstr(0xa936, 16, delta(1, uint(8)))
export const MODPOW2_ = createUnaryInstr(0xa938, 16, delta(1, uint(8)))
export const MODPOW2R_ = createUnaryInstr(0xa939, 16, delta(1, uint(8)))
export const MODPOW2C_ = createUnaryInstr(0xa93a, 16, delta(1, uint(8)))
export const RSHIFT_MOD = createUnaryInstr(0xa93c, 16, delta(1, uint(8)))
export const RSHIFTR_MOD = createUnaryInstr(0xa93d, 16, delta(1, uint(8)))
export const RSHIFTC_MOD = createUnaryInstr(0xa93e, 16, delta(1, uint(8)))
export const MULADDRSHIFT_MOD = createUnaryInstr(0xa9b0, 16, delta(1, uint(8)))
export const MULADDRSHIFTR_MOD = createUnaryInstr(0xa9b1, 16, delta(1, uint(8)))
export const MULADDRSHIFTC_MOD = createUnaryInstr(0xa9b2, 16, delta(1, uint(8)))
export const MULRSHIFT_ = createUnaryInstr(0xa9b4, 16, delta(1, uint(8)))
export const MULRSHIFTR_ = createUnaryInstr(0xa9b5, 16, delta(1, uint(8)))
export const MULRSHIFTC_ = createUnaryInstr(0xa9b6, 16, delta(1, uint(8)))
export const MULMODPOW2_ = createUnaryInstr(0xa9b8, 16, delta(1, uint(8)))
export const MULMODPOW2R_ = createUnaryInstr(0xa9b9, 16, delta(1, uint(8)))
export const MULMODPOW2C_ = createUnaryInstr(0xa9ba, 16, delta(1, uint(8)))
export const MULRSHIFT_MOD = createUnaryInstr(0xa9bc, 16, delta(1, uint(8)))
export const MULRSHIFTR_MOD = createUnaryInstr(0xa9bd, 16, delta(1, uint(8)))
export const MULRSHIFTC_MOD = createUnaryInstr(0xa9be, 16, delta(1, uint(8)))
export const LSHIFT_ADDDIVMOD = createUnaryInstr(0xa9d0, 16, delta(1, uint(8)))
export const LSHIFT_ADDDIVMODR = createUnaryInstr(0xa9d1, 16, delta(1, uint(8)))
export const LSHIFT_ADDDIVMODC = createUnaryInstr(0xa9d2, 16, delta(1, uint(8)))
export const LSHIFT_DIV = createUnaryInstr(0xa9d4, 16, delta(1, uint(8)))
export const LSHIFT_DIVR = createUnaryInstr(0xa9d5, 16, delta(1, uint(8)))
export const LSHIFT_DIVC = createUnaryInstr(0xa9d6, 16, delta(1, uint(8)))
export const LSHIFT_MOD = createUnaryInstr(0xa9d8, 16, delta(1, uint(8)))
export const LSHIFT_MODR = createUnaryInstr(0xa9d9, 16, delta(1, uint(8)))
export const LSHIFT_MODC = createUnaryInstr(0xa9da, 16, delta(1, uint(8)))
export const LSHIFT_DIVMOD = createUnaryInstr(0xa9dc, 16, delta(1, uint(8)))
export const LSHIFT_DIVMODR = createUnaryInstr(0xa9dd, 16, delta(1, uint(8)))
export const LSHIFT_DIVMODC = createUnaryInstr(0xa9de, 16, delta(1, uint(8)))
export const HASHEXT = createUnaryInstr(0xf904, 16, hash)
export const HASHEXTR = createUnaryInstr(0xf905, 16, hash)
export const HASHEXTA = createUnaryInstr(0xf906, 16, hash)
export const HASHEXTAR = createUnaryInstr(0xf907, 16, hash)
export const STREF = () => createSimpleInstr("STREF", 0xcc, 8);
export const STSLICE = () => createSimpleInstr("STSLICE", 0xce, 8);
export const XCHG3 = createTernaryInstr(0x4, 4, uint(4), uint(4), uint(4))
export const STI = createUnaryInstr(0xca, 8, delta(1, uint(8)))
export const STU = createUnaryInstr(0xcb, 8, delta(1, uint(8)))
export const LDI = createUnaryInstr(0xd2, 8, delta(1, uint(8)))
export const LDU = createUnaryInstr(0xd3, 8, delta(1, uint(8)))
export const LDSLICE = createUnaryInstr(0xd6, 8, delta(1, uint(8)))
export const LSHIFT = () => createSimpleInstr("LSHIFT", 0xac, 8);
export const LSHIFT_1 = createUnaryInstr(0xaa, 8, delta(1, uint(8)))
export const QLSHIFT = () => createSimpleInstr("QLSHIFT", 0xb7ac, 16);
export const QLSHIFT_1 = createUnaryInstr(0xb7aa, 16, delta(1, uint(8)))
export const BCHKBITS = () => createSimpleInstr("BCHKBITS", 0xcf39, 16);
export const BCHKBITS_1 = createUnaryInstr(0xcf38, 16, delta(1, uint(8)))
export const BCHKBITSQ = () => createSimpleInstr("BCHKBITSQ", 0xcf3d, 16);
export const BCHKBITSQ_1 = createUnaryInstr(0xcf3c, 16, delta(1, uint(8)))
export const RSHIFT = () => createSimpleInstr("RSHIFT", 0xad, 8);
export const RSHIFT_1 = createUnaryInstr(0xab, 8, delta(1, uint(8)))
export const QRSHIFT = () => createSimpleInstr("QRSHIFT", 0xb7ad, 16);
export const QRSHIFT_1 = createUnaryInstr(0xb7ab, 16, delta(1, uint(8)))
export const CALLDICT = createUnaryInstr(0xf0, 8, uint(8))
export const CALLDICT_LONG = createUnaryInstr(0x3c4, 10, uint(14))
export const THROW = createUnaryInstr(0x1e58, 13, uint(11))
export const THROWIF_SHORT = createUnaryInstr(0x3c9, 10, uint(6))
export const THROWIF = createUnaryInstr(0x1e5a, 13, uint(11))
export const THROWIFNOT_SHORT = createUnaryInstr(0x3ca, 10, uint(6))
export const THROWIFNOT = createUnaryInstr(0x1e5c, 13, uint(11))
export const PUSHINT = createUnaryInstr(0x7, 4, tinyInt)
export const PUSHINT_8 = createUnaryInstr(0x80, 8, int(8))
export const PUSHINT_16 = createUnaryInstr(0x81, 8, int(16))
export const XCHG_LONG = createUnaryInstr(0x11, 8, uint(8))
export const XCHG_1 = createUnaryInstr(0x10, 8, xchgArgs)
export const XCHG_3 = createFixedRangeInstr(0x12, 4, 4, seq2(s1, stack(4)))
export const DUMPSTK = () => createSimpleInstr("DUMPSTK", 0xfe00, 16);
export const DEBUG = createFixedRangeInstr(0xfe01, 8, 8, uint(8))
export const STRDUMP = () => createSimpleInstr("STRDUMP", 0xfe14, 16);
export const DEBUG_1 = createFixedRangeInstr(0xfe15, 8, 8, uint(8))
export const DUMP = createUnaryInstr(0xfe2, 12, uint(4))
export const DEBUG_2 = createFixedRangeInstr(0xfe30, 8, 8, uint(8))
export const PUSHCTR = createFixedRangeInstr(0xed40, 12, 4, control)
export const PUSH = createFixedRangeInstr(0x22, 4, 4, uint(4))
export const PUSH_LONG = createUnaryInstr(0x56, 8, uint(8))
export const POPCTR = createFixedRangeInstr(0xed50, 12, 4, control)
export const POP = createFixedRangeInstr(0x32, 4, 4, uint(4))
export const POP_LONG = createUnaryInstr(0x57, 8, uint(8))
export const CALLXARGS = createBinaryInstr(0xdb0, 12, uint(4), minusOne)
export const CALLXARGS_1 = createBinaryInstr(0xda, 8, uint(4), uint(4))
export const SETCP = createFixedRangeInstr(0xff00, 8, 8, uint(8))
export const SETCP_1 = createFixedRangeInstr(0xfff1, 8, 8, delta(-256, uint(8)))
