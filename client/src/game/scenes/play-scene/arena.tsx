import React from "react";
import { settings } from "@app/shared";
import { Instance, Instances } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";

const SIZE = settings.arena.size;
const CELL = settings.arena.cell;

const maxTiles = (SIZE / CELL.size) ** 2;
const tiles: null[] = [];
for (let i = 0; i < maxTiles; i++) {
  tiles.push(null);
}

function Arena() {
  const cellRefs = React.useRef<Position[]>([]);

  return (
    <group position={[SIZE * -0.5, SIZE * -0.5, -1]}>
      <Instances limit={maxTiles} range={maxTiles}>
        <planeBufferGeometry args={[CELL.size, CELL.size]} />
        <meshBasicMaterial color="#333333" />
        {tiles.map((_, index) => {
          const col = Math.floor(index % (SIZE / CELL.size));
          const row = Math.floor(index / (SIZE / CELL.size));
          const x = (CELL.size + CELL.gap) * col;
          const y = (CELL.size + CELL.gap) * row;
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

export default React.memo(Arena);
