import React from "react";
import { settings } from "@app/shared";
import { Instance, Instances } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

const SIZE = settings.arena.size;
const CELL = settings.arena.cell;

const maxCells = (SIZE / CELL.size) ** 2;
const cells = Array.from({ length: maxCells });

function Arena() {
  const cellRefs = React.useRef<Position[]>([]);

  useFrame(({ clock }) => {
    const d = (1 + Math.sin(clock.getElapsedTime())) / 2;
    const s = MathUtils.mapLinear(d, 0, 1, 0.5, 0.8);
    for (let i = 0; i < maxCells; i++) {
      cellRefs.current[i].scale.setScalar(s);
    }
  });

  return (
    <group position={[SIZE * -0.5, SIZE * -0.5, -1]}>
      <Instances limit={maxCells} range={maxCells}>
        <planeBufferGeometry args={[CELL.size, CELL.size]} />
        <meshBasicMaterial color="#333333" />
        {cells.map((_, index) => {
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
