import React from "react";
import { settings } from "@app/shared";
import { InstancedMesh, MathUtils } from "three";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import { useFrame } from "@react-three/fiber";
import gameState from "../../game-state";
import { encodeSvg } from "../../utils";

const SIZE = settings.food.size;

const maxFoods = 500;
const foods = Array.from({ length: maxFoods });

function Foods() {
  const instancesRef = React.useRef<InstancedMesh>();
  const instanceRefs = React.useRef<Position[]>([]);

  useFrame(({ clock }) => {
    instancesRef.current.count = gameState.foods.length;
    for (let i = 0; i < maxFoods; i++) {
      if (!gameState.foods[i]) {
        instanceRefs.current[i].scale.setScalar(0);
        continue;
      }

      const scale = MathUtils.mapLinear(
        (1 + Math.sin(clock.getElapsedTime())) / 2,
        0,
        1,
        0.5,
        1
      );
      instanceRefs.current[i].scale.setScalar(scale);
      instanceRefs.current[i].position.set(
        gameState.foods[i].x,
        gameState.foods[i].y,
        0
      );
    }
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
    <Instances limit={maxFoods} range={0} ref={instancesRef}>
      <circleBufferGeometry args={[SIZE, 32, 32]} />
      <meshBasicMaterial map={texture} transparent />
      {foods.map((food, index) => {
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
