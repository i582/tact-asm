/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { beginCell, Builder } from "@ton/core";

//
// Tree Build
//

function pad(src: string, size: number) {
    while (src.length < size) {
        src = '0' + src;
    }
    return src;
}

export type Node<T> =
    | {
    type: 'fork',
    left: Edge<T>,
    right: Edge<T>
}
    | {
    type: 'leaf',
    value: T
}

export type LabelType = 'short' | 'long' | 'same'

export type Edge<T> = {
    label: string,
    node: Node<T>
    type: LabelType;
};

function removePrefixMap<T>(src: Map<string, T>, length: number) {
    if (length === 0) {
        return src;
    }

    const res = new Map<string, T>();
    for (const k of src.keys()) {
        const d = src.get(k)!;
        res.set(k.slice(length), d);
    }
    return res;
}

function forkMap<T>(src: Map<string, T>, prefixLen: number) {
    if (src.size === 0) {
        throw Error('Internal inconsistency');
    }

    const left = new Map<string, T>();
    const right = new Map<string, T>();
    for (const [k, d] of src.entries()) {
        if (k[prefixLen] === '0') {
            left.set(k, d);
        } else {
            right.set(k, d);
        }
    }
    if (left.size === 0) {
        throw Error('Internal inconsistency. Left emtpy.')
    }
    if (right.size === 0) {
        throw Error('Internal inconsistency. Right emtpy.')
    }
    return { left, right };
}

function buildNode<T>(src: Map<string, T>, prefixLen: number, keyLength: number): Node<T> {
    if (src.size === 0) {
        throw Error('Internal inconsistency');
    }
    if (src.size === 1) {
        return { type: 'leaf', value: Array.from(src.values())[0] };
    }
    const { left, right } = forkMap(src, prefixLen);
    return {
        type: 'fork',
        left: buildEdge(left, prefixLen + 1, keyLength),
        right: buildEdge(right, prefixLen + 1, keyLength)
    }
}

function buildEdge<T>(src: Map<string, T>, prefixLen: number, keyLength: number): Edge<T> {
    if (src.size === 0) {
        throw Error('Internal inconsistency');
    }
    const label = findCommonPrefix(Array.from(src.keys()), prefixLen);
    return {
        label,
        node: buildNode(src, label.length + prefixLen, keyLength),
        type: detectLabelType(label, keyLength),
    };
}

export function buildTree<T>(src: Map<bigint, T>, keyLength: number) {
    // Convert map keys
    const converted = new Map<string, T>();
    for (const k of Array.from(src.keys())) {
        const padded = pad(k.toString(2), keyLength);
        converted.set(padded, src.get(k)!);
    }

    // Calculate root label
    return buildEdge(converted, 0, keyLength);
}

//
// Serialization
//

export function writeLabelShort(src: string, to: Builder) {
    // Header
    to.storeBit(0);

    // Unary length
    for (let i = 0; i < src.length; i++) {
        to.storeBit(1);
    }
    to.storeBit(0);

    // Value
    if (src.length > 0) {
        to.storeUint(BigInt('0b' + src), src.length);
    }
    return to;
}

function labelShortLength(src: string) {
    return 1 + src.length + 1 + src.length;
}

export function writeLabelLong(src: string, keyLength: number, to: Builder) {
    // Header
    to.storeBit(1);
    to.storeBit(0);

    // Length
    const length = Math.ceil(Math.log2(keyLength + 1));
    to.storeUint(src.length, length);

    // Value
    if (src.length > 0) {
        to.storeUint(BigInt('0b' + src), src.length);
    }
    return to;
}

function labelLongLength(src: string, keyLength: number) {
    return 1 + 1 + Math.ceil(Math.log2(keyLength + 1)) + src.length;
}

export function writeLabelSame(value: number | boolean, length: number, keyLength: number, to: Builder) {
    // Header
    to.storeBit(1);
    to.storeBit(1);

    // Value
    to.storeBit(value);

    // Length
    const lenLen = Math.ceil(Math.log2(keyLength + 1));
    to.storeUint(length, lenLen);
}

function labelSameLength(keyLength: number) {
    return 1 + 1 + 1 + Math.ceil(Math.log2(keyLength + 1));
}

function isSame(src: string) {
    if (src.length === 0 || src.length === 1) {
        return true;
    }
    for (let i = 1; i < src.length; i++) {
        if (src[i] !== src[0]) {
            return false;
        }
    }
    return true;
}

export function detectLabelType(src: string, keyLength: number) {
    let kind: 'short' | 'long' | 'same' = 'short';
    let kindLength = labelShortLength(src);

    const longLength = labelLongLength(src, keyLength);
    if (longLength < kindLength) {
        kindLength = longLength;
        kind = 'long';
    }

    if (isSame(src)) {
        let sameLength = labelSameLength(keyLength);
        if (sameLength < kindLength) {
            return 'same';
        }
    }

    return kind;
}

function writeNode<T>(src: Node<T>, keyLength: number, serializer: (src: T, cell: Builder) => void, to: Builder) {
    if (src.type === 'leaf') {
        serializer(src.value, to);
    }

    if (src.type === 'fork') {
        const leftCell = beginCell();
        const rightCell = beginCell();
        writeEdge(src.left, keyLength - 1, serializer, leftCell);
        writeEdge(src.right, keyLength - 1, serializer, rightCell);
        to.storeRef(leftCell);
        to.storeRef(rightCell);
    }
}

export function writeEdge<T>(src: Edge<T>, keyLength: number, serializer: (src: T, cell: Builder) => void, to: Builder) {
    const label = src.label;
    const type = src.type;

    if (type === 'short') {
        writeLabelShort(label, to);
    } else if (type === 'long') {
        writeLabelLong(label, keyLength, to);
    } else if (type === 'same') {
        writeLabelSame(label[0] === '1', label.length, keyLength, to);
    }

    writeNode(src.node, keyLength - src.label.length, serializer, to);
}

export function serializeDict<T>(src: Map<bigint, T>, keyLength: number, serializer: (src: T, cell: Builder) => void, to: Builder) {
    const tree = buildTree<T>(src, keyLength);
    writeEdge(tree, keyLength, serializer, to);
}

function findCommonPrefix(src: string[], startPos = 0): string {
    // Corner cases
    if (src.length === 0) {
        return '';
    }
    let r = src[0].slice(startPos);
    for (let i = 1; i < src.length; i++) {
        const s = src[i];
        while (s.indexOf(r, startPos) !== startPos) {
            r = r.substring(0, r.length - 1);
            if (r === '') {
                return r;
            }
        }
    }
    return r;
}
