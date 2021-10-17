import React from "react";
import { settings } from "@app/shared";
import { Instance, Instances } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";

// const SIZE = settings.arena.size;
const SIZE = 25;

const cell = {
  size: Math.sqrt(SIZE),
  gap: 0,
};

const maxTiles = SIZE * SIZE;
const tiles = Array.from({ length: maxTiles });

export default function Arena() {
  const cellRefs = React.useRef<Position[]>([]);

  return (
    <group position={[0, 0, -1]}>
      <Instances limit={maxTiles} range={maxTiles}>
        <planeBufferGeometry args={[cell.size, cell.size]} />
        <meshBasicMaterial color="crimson" />
        {tiles.map((_, index) => {
          const col = index % cell.size;
          const row = Math.floor(index / cell.size);
          const x = (cell.size + cell.gap) * col;
          const y = (cell.size + cell.gap) * row;
          return (
            <Instance
              key={index}
              position={[x, y, 0]}
              ref={(ref) => {
                if (ref instanceof Position) {
                  cellRefs.current[index] = ref;
                }
              }}
            />
          );
        })}
      </Instances>
    </group>
  );
}
