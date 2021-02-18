// Create a fixed length array of entity objects (avoids heavy GC calls)

export function createEntityBuffer<T>(size: number, entity: T): T[] {
  const buffer: T[] = [];
  for (let i = 0; i < size; i++) {
    buffer.push({ ...entity });
  }
  return buffer;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// export function isPlayerHit(
//   bullet: EngineBullet,
//   player: EnginePlayer,
//   r: number
// ): boolean {
//   if (player.id === bullet.playerId) return false;
//   const a = bullet.x - player.x;
//   const b = bullet.y - player.y;
//   const d = Math.sqrt(a * a + b * b);
//   return d <= r;
// }
