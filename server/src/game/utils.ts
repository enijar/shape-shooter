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

export function collision(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  r: number = 0.05
): boolean {
  const a = x1 - x2;
  const b = y1 - y2;
  const d = Math.sqrt(a * a + b * b);
  return d <= r;
}
