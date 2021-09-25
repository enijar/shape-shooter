import React from "react";
import { settings } from "@app/shared";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";
import server from "../../../services/server";
import { Position } from "@react-three/drei/helpers/Position";

type Bullet = {
  id: string;
  playerId: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
};

type BulletState = {
  id?: string;
  playerId?: string;
  color: THREE.Color;
  position: THREE.Vector3;
  rotation: THREE.Euler;
};

const bullets: BulletState[] = Array.from({ length: 100 }).map(() => {
  return {
    color: new THREE.Color("#ffffff"),
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
  };
});

export default function Bullets() {
  const instanceRefs = React.useRef<Position[]>([]);

  React.useEffect(() => {
    server.on("tick", (state: { bullets: Bullet[] }) => {
      for (let i = 0, length = bullets.length; i < length; i++) {
        if (!instanceRefs.current[i]) continue;
        if (!state.bullets[i]) {
          instanceRefs.current[i].scale.x = 0;
          continue;
        }
        instanceRefs.current[i].rotateZ(state.bullets[i].rotation);
        instanceRefs.current[i].color.set(state.bullets[i].color);
        instanceRefs.current[i].position.set(
          state.bullets[i].x,
          state.bullets[i].y,
          0
        );
        instanceRefs.current[i].scale.x = 1;
      }
    });
  }, []);

  React.useEffect(() => {
    let shooting = false;

    function shoot() {
      shooting = !shooting;
      server.emit("shooting", shooting, { reliable: true });
    }

    window.addEventListener("pointerdown", shoot);
    window.addEventListener("pointerup", shoot);
    return () => {
      window.removeEventListener("pointerdown", shoot);
      window.removeEventListener("pointerup", shoot);
    };
  }, []);

  return (
    <Instances limit={bullets.length}>
      <circleBufferGeometry
        args={[settings.bullet.size, settings.bullet.size, 32]}
      />
      <meshStandardMaterial />
      {bullets.map((bullet, index) => {
        return (
          <Instance
            ref={(ref) => {
              if (ref instanceof Position) {
                instanceRefs.current[index] = ref;
                instanceRefs.current[index].scale.x = 0;
              }
            }}
            key={index}
          />
        );
      })}
    </Instances>
  );
}
