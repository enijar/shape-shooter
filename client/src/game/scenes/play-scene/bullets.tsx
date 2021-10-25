import React from "react";
import { settings } from "@app/shared";
import { InstancedMesh } from "three";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import gameState from "../../game-state";
import { encodeSvg } from "../../utils";
import useSubscription from "../../hooks/use-subscription";
import { Subscription } from "../../types";
import { ENTITIES, MAX_ENTITIES } from "../../consts";

const SIZE = settings.bullet.size;

function Bullets() {
  const instancesRef = React.useRef<InstancedMesh>();
  const instanceRefs = React.useRef<Position[]>([]);

  useSubscription(Subscription.tick, (i: number) => {
    instancesRef.current.count = gameState.bullets.length;
    if (!instanceRefs.current[i]) return;
    if (!gameState.bullets[i]) {
      return instanceRefs.current[i].scale.setScalar(0);
    }
    instanceRefs.current[i].scale.setScalar(1);
    instanceRefs.current[i].rotateZ(gameState.bullets[i][3]);
    instanceRefs.current[i].color.set(gameState.bullets[i][0]);
    instanceRefs.current[i].position.set(
      gameState.bullets[i][1],
      gameState.bullets[i][2],
      0
    );
  });

  const texture = useTexture(
    encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
<circle cx="${SIZE * 0.5}" cy="${SIZE * 0.5}" r="${SIZE * 0.5}" fill="white"/>
</svg>`
    )
  );

  return (
    <Instances ref={instancesRef} limit={MAX_ENTITIES} range={0}>
      <circleBufferGeometry args={[SIZE, 32, 32]} />
      <meshBasicMaterial map={texture} transparent />
      {ENTITIES.map((_, index) => {
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
