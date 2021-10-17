import React from "react";
import { settings } from "@app/shared";
import { InstancedMesh } from "three";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import { useFrame } from "@react-three/fiber";
import gameState from "../../game-state";
import { encodeSvg } from "../../utils";

const SIZE = settings.bullet.size;

const maxBullets = 500;
const bullets = Array.from({ length: maxBullets });

function Bullets() {
  const instancesRef = React.useRef<InstancedMesh>();
  const instanceRefs = React.useRef<Position[]>([]);

  useFrame(() => {
    instancesRef.current.count = gameState.bullets.length;
    for (let i = 0; i < maxBullets; i++) {
      if (!gameState.bullets[i]) {
        instanceRefs.current[i].scale.setScalar(0);
        continue;
      }
      instanceRefs.current[i].scale.setScalar(1);
      instanceRefs.current[i].rotateZ(gameState.bullets[i].rotation);
      instanceRefs.current[i].color.set(gameState.bullets[i].color);
      instanceRefs.current[i].position.set(
        gameState.bullets[i].x,
        gameState.bullets[i].y,
        0
      );
    }
  });

  const texture = useTexture(
    encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
<circle cx="${SIZE * 0.5}" cy="${SIZE * 0.5}" r="${SIZE * 0.5}" fill="white"/>
</svg>`
    )
  );

  return (
    <Instances limit={maxBullets} range={0} ref={instancesRef}>
      <circleBufferGeometry args={[SIZE, 32, 32]} />
      <meshBasicMaterial map={texture} transparent />
      {bullets.map((_, index) => {
        return (
          <Instance
            ref={(ref) => {
              if (ref instanceof Position) {
                instanceRefs.current[index] = ref;
                instanceRefs.current[index].scale.setScalar(0);
              }
            }}
            key={index}
          />
        );
      })}
    </Instances>
  );
}

export default React.memo(Bullets);
