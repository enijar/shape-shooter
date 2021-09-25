import { Box } from "./types";

export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const a = Math.abs(x1 - x2);
  const b = Math.abs(y1 - y2);
  return Math.sqrt(a * a + b * b);
}

export function intersect(a: Box, b: Box): boolean {
  return (
    Math.abs(a.x - b.x) * 2 < a.width + b.width &&
    Math.abs(a.y - b.y) * 2 < a.height + b.height
  );
}
