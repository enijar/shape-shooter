export function createEntityBuffer<T>(size: number, entity: T): T[] {
  const buffer: T[] = [];
  for (let i = 0; i < size; i++) {
    buffer.push({ ...entity });
  }
  return buffer;
}
