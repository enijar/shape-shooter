import Player from "./game/entities/player";

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

export function dist(x1: number, y1: number, x2: number, y2: number): number {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.sqrt(a * a + b * b);
}

export function collision(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  r: number = 0.05
): boolean {
  return dist(x1, y1, x2, y2) <= r;
}

export function rand(min: number, max: number): number {
  return map(Math.random(), 0, 1, min, max);
}

export function closestPlayer(
  player: Player,
  players: Player[]
): { player: Player | null; distance: number } {
  let closest = null;
  let smallestDistance = Infinity;
  for (let i = players.length - 1; i >= 0; i--) {
    if (players[i].id === player.id) {
      continue;
    }
    const distance = dist(player.x, player.y, players[i].x, players[i].y);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closest = players[i];
    }
  }
  return { player: closest, distance: smallestDistance };
}

export function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function rad2deg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function guid(): string {
  function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}
