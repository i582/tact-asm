export const entries = Object.entries as <O>(
    o: O,
) => { [K in keyof O]: [K, O[K]] }[keyof O][];

export const keys = Object.keys as <O>(o: O) => (keyof O)[];

export type EnumKeys<Enum> = Exclude<keyof Enum, number>

export const enumObject = <Enum extends Record<string, number | string>>(e: Enum) => {
    const copy = {...e} as { [K in EnumKeys<Enum>]: Enum[K] };
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    Object.values(e).forEach(value => typeof value === 'number' && delete copy[value]);
    return copy;
};
