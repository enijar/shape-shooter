import React from "react";
import { settings } from "@app/shared";
import * as THREE from "three";
import { Html, Instance, Instances } from "@react-three/drei";
import server from "../../../services/server";
import { Position } from "@react-three/drei/helpers/Position";
import { Bar, BarFill } from "../../styles";

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
  const htmlRefs = React.useRef<HTMLDivElement[]>([]);
  const healthBarRefs = React.useRef<HTMLDivElement[]>([]);

  React.useEffect(() => {
    server.on("tick", (state: { items: Item[] }) => {
      for (let i = 0, length = items.length; i < length; i++) {
        if (!instanceRefs.current[i]) continue;
        if (!state.items[i]) {
          instanceRefs.current[i].scale.x = 0;
          htmlRefs.current[i].style.opacity = "0";
          healthBarRefs.current[i].style.width = "100%";
          continue;
        }

        const item = state.items[i];

        // Health
        const health = (100 / item.maxHealth) * item.health;
        healthBarRefs.current[i].style.width = `${health}%`;

        htmlRefs.current[i].style.opacity = "1";
        instanceRefs.current[i].color.set(state.items[i].color);
        instanceRefs.current[i].position.set(
          state.items[i].x,
          state.items[i].y,
          0
        );
        instanceRefs.current[i].scale.x = 1;
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
            <Html
              ref={(ref) => {
                if (ref instanceof HTMLDivElement) {
                  htmlRefs.current[index] = ref;
                }
              }}
              style={{
                pointerEvents: "none",
                userSelect: "none",
                opacity: "0",
                width: `${settings.item.size * (Math.PI * 0.5)}px`,
                transform: "translate(-50%, 0.5em)",
              }}
              position={[0, -settings.item.size, 0]}
            >
              <Bar height={5}>
                <BarFill
                  ref={(ref) => {
                    if (ref instanceof HTMLDivElement) {
                      healthBarRefs.current[index] = ref;
                    }
                  }}
                  style={{ width: "100%" }}
                  color="hsl(120, 83%, 37%)"
                />
              </Bar>
            </Html>
          </Instance>
        );
      })}
    </Instances>
  );
}
