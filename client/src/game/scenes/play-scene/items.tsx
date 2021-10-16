import React from "react";
import { settings } from "@app/shared";
import { Mesh } from "three";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import { useFrame } from "@react-three/fiber";
import gameState from "../../game-state";
import { encodeSvg } from "../../utils";

const SIZE = settings.item.size;

const maxItems = 500;
const items = Array.from({ length: maxItems });

function Items() {
  const instanceRefs = React.useRef<Position[]>([]);
  const healthBarRefs = React.useRef<Mesh[]>([]);

  useFrame(() => {
    for (let i = 0; i < maxItems; i++) {
      if (!instanceRefs.current[i]) continue;
      if (!gameState.items[i]) {
        instanceRefs.current[i].scale.x = 0;
        continue;
      }

      const item = gameState.items[i];

      instanceRefs.current[i].scale.x = 1;
      instanceRefs.current[i].position.set(item.x, item.y, 0);
      instanceRefs.current[i].color.setStyle(item.color);

      // Health
      const health = (1 / item.maxHealth) * item.health;
      healthBarRefs.current[i].scale.x = health;
      healthBarRefs.current[i].position.x = SIZE * -2 * (1 - health) * 0.5;
    }
  });

  const texture = useTexture(
    encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="10" height="10">
<circle cx="${SIZE * 0.5}" cy="${SIZE * 0.5}" r="${SIZE * 0.5}" fill="white"/>
</svg>`
    )
  );

  return (
    <Instances limit={maxItems}>
      <circleBufferGeometry args={[SIZE, 32, 32]} />
      <meshBasicMaterial map={texture} />
      {items.map((_, index) => {
        return (
          <Instance
            ref={(ref) => {
              if (ref instanceof Position) {
                instanceRefs.current[index] = ref;
                instanceRefs.current[index].scale.x = 0;
              }
            }}
            key={index}
          >
            <mesh position={[0, -22, -0.01]}>
              <planeBufferGeometry args={[SIZE * 2, 5]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh
              position={[0, -22, 0]}
              ref={(ref) => {
                healthBarRefs.current[index] = ref as Mesh;
              }}
            >
              <planeBufferGeometry args={[SIZE * 2, 5]} />
              <meshBasicMaterial color="hsl(120, 83%, 37%)" />
            </mesh>
          </Instance>
        );
      })}
    </Instances>
  );
}

export default React.memo(Items);
