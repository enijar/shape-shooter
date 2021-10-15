import React from "react";
import { settings } from "@app/shared";
import { Color, Vector3, Mesh } from "three";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import { useFrame } from "@react-three/fiber";
import gameState from "../../game-state";
import { encodeSvg } from "../../utils";

const SIZE = settings.item.size;

type ItemState = {
  id?: string;
  color: Color;
  position: Vector3;
};

const items: ItemState[] = Array.from({ length: 100 }).map(() => {
  return {
    color: new Color("#ffffff"),
    position: new Vector3(0, 0, 0),
  };
});

export default function Items() {
  const instanceRefs = React.useRef<Position[]>([]);
  const healthBarRefs = React.useRef<Mesh[]>([]);

  useFrame(() => {
    for (let i = 0, length = items.length; i < length; i++) {
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
    <Instances limit={items.length}>
      <circleBufferGeometry args={[settings.item.size, 32]} />
      <meshBasicMaterial map={texture} />
      {items.map((item, index) => {
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
              <planeBufferGeometry args={[settings.item.size * 2, 5]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh
              position={[0, -22, 0]}
              ref={(ref) => {
                healthBarRefs.current[index] = ref as Mesh;
              }}
            >
              <planeBufferGeometry args={[settings.item.size * 2, 5]} />
              <meshBasicMaterial color="hsl(120, 83%, 37%)" />
            </mesh>
          </Instance>
        );
      })}
    </Instances>
  );
}
