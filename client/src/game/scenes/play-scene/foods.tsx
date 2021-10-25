import React from "react";
import { settings } from "@app/shared";
import { InstancedMesh, MathUtils } from "three";
import { RootState } from "@react-three/fiber";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import { encodeSvg } from "../../utils";
import { ENTITIES, MAX_ENTITIES } from "../../consts";
import useSubscription from "../../hooks/use-subscription";
import { Subscription } from "../../types";
import gameState from "../../game-state";

const SIZE = settings.food.size;

function Foods() {
  const instancesRef = React.useRef<InstancedMesh>();
  const instanceRefs = React.useRef<Position[]>([]);

  useSubscription(Subscription.tick, (i: number, state: RootState) => {
    instancesRef.current.count = gameState.foods.length;
    if (!instanceRefs.current[i]) return;
    if (!gameState.foods[i]) {
      return instanceRefs.current[i].scale.setScalar(0);
    }

    const scale = MathUtils.mapLinear(
      (1 + Math.sin(state.clock.getElapsedTime())) / 2,
      0,
      1,
      0.5,
      1
    );
    instanceRefs.current[i].scale.setScalar(scale);
    instanceRefs.current[i].position.set(
      gameState.foods[i][0],
      gameState.foods[i][1],
      0
    );
  });

  const texture = useTexture(
    encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="10" height="10">
<circle cx="${SIZE * 0.5}" cy="${SIZE * 0.5}" r="${
        SIZE * 0.5
      }" fill="limegreen"/>
</svg>`
    )
  );

  return (
    <Instances ref={instancesRef} limit={MAX_ENTITIES} range={0}>
      <circleBufferGeometry args={[SIZE, 32, 32]} />
      <meshBasicMaterial map={texture} transparent />
      {ENTITIES.map((food, index) => {
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

export default React.memo(Foods);
