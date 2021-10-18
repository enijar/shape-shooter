import { Box } from "./types";

const _lut: string[] = [];
for (let i = 0; i < 256; i++) {
  _lut[i] = (i < 16 ? "0" : "") + i.toString(16);
}

export function generateUUID(): string {
  // https://github.com/mrdoob/three.js/blob/dev/src/math/MathUtils.js#L18
  const d0 = (Math.random() * 0xffffffff) | 0;
  const d1 = (Math.random() * 0xffffffff) | 0;
  const d2 = (Math.random() * 0xffffffff) | 0;
  const d3 = (Math.random() * 0xffffffff) | 0;
  const uuid =
    _lut[d0 & 0xff] +
    _lut[(d0 >> 8) & 0xff] +
    _lut[(d0 >> 16) & 0xff] +
    _lut[(d0 >> 24) & 0xff] +
    "-" +
    _lut[d1 & 0xff] +
    _lut[(d1 >> 8) & 0xff] +
    "-" +
    _lut[((d1 >> 16) & 0x0f) | 0x40] +
    _lut[(d1 >> 24) & 0xff] +
    "-" +
    _lut[(d2 & 0x3f) | 0x80] +
    _lut[(d2 >> 8) & 0xff] +
    "-" +
    _lut[(d2 >> 16) & 0xff] +
    _lut[(d2 >> 24) & 0xff] +
    _lut[d3 & 0xff] +
    _lut[(d3 >> 8) & 0xff] +
    _lut[(d3 >> 16) & 0xff] +
    _lut[(d3 >> 24) & 0xff];
  return uuid.toUpperCase();
}

// https://github.com/mrdoob/three.js/blob/dev/src/math/MathUtils.js#L124
export function randInt(low: number, high: number): number {
  return low + Math.floor(Math.random() * (high - low + 1));
}

export function dist(boxA: Box, boxB: Box): number {
  const a = boxA.x - boxB.x;
  const b = boxA.y - boxB.y;
  return Math.sqrt(a * a + b * b);
}

export function fixDecimal(decimal: number, places = 2): number {
  const fix = Math.pow(10, places);
  return Math.round(decimal * fix) / fix;
}
