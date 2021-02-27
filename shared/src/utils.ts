export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function map(
  value: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
}
