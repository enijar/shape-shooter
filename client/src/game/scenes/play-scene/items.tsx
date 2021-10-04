import React from "react";
import { settings } from "@app/shared";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import server from "../../../services/server";

type Item = {
  id: string;
  color: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
};

type ItemState = {
  id?: string;
  color: THREE.Color;
  position: THREE.Vector3;
};

const items: ItemState[] = Array.from({ length: 100 }).map(() => {
  return {
    color: new THREE.Color("#ffffff"),
    position: new THREE.Vector3(0, 0, 0),
  };
});

export default function Items() {
  const instanceRefs = React.useRef<Position[]>([]);
  const healthBarRefs = React.useRef<THREE.Mesh[]>([]);

  React.useEffect(() => {
    server.on("tick", (state: { items: Item[] }) => {
      for (let i = 0, length = items.length; i < length; i++) {
        if (!instanceRefs.current[i]) continue;
        if (!state.items[i]) {
          instanceRefs.current[i].scale.x = 0;
          continue;
        }

        const item = state.items[i];

        instanceRefs.current[i].scale.x = 1;
        instanceRefs.current[i].position.set(item.x, item.y, 0);
        instanceRefs.current[i].color.setStyle(item.color);

        // Health
        const health = (1 / item.maxHealth) * item.health;
        healthBarRefs.current[i].scale.x = health;
        healthBarRefs.current[i].position.x =
          settings.item.size * -2 * (1 - health) * 0.5;
      }
    });
  }, []);

  return (
    <Instances limit={items.length}>
      <circleBufferGeometry
        args={[settings.item.size, settings.item.size, 32]}
      />
      <meshStandardMaterial />
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
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh
              position={[0, -22, 0]}
              ref={(ref) => {
                healthBarRefs.current[index] = ref as THREE.Mesh;
              }}
            >
              <planeBufferGeometry args={[settings.item.size * 2, 5]} />
              <meshStandardMaterial color="hsl(120, 83%, 37%)" />
            </mesh>
          </Instance>
        );
      })}
    </Instances>
  );
}
