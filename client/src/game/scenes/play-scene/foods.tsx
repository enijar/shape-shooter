import React from "react";
import { settings } from "@app/shared";
import { Vector3, MathUtils } from "three";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import { useFrame } from "@react-three/fiber";
import gameState from "../../game-state";
import { encodeSvg } from "../../utils";

const SIZE = settings.food.size;

type FoodState = {
  id?: string;
  position: Vector3;
};

const foods: FoodState[] = Array.from({ length: 100 }).map(() => {
  return {
    position: new Vector3(0, 0, 0),
  };
});

export default function Foods() {
  const instanceRefs = React.useRef<Position[]>([]);

  useFrame(({ clock }) => {
    for (let i = 0, length = foods.length; i < length; i++) {
      if (!instanceRefs.current[i]) continue;
      if (!gameState.foods[i]) {
        instanceRefs.current[i].scale.x = 0;
        continue;
      }

      const food = gameState.foods[i];

      const s = MathUtils.mapLinear(
        (1 + Math.sin(clock.getElapsedTime())) / 2,
        0,
        1,
        0.5,
        1
      );
      instanceRefs.current[i].scale.set(s, s, s);
      instanceRefs.current[i].position.set(food.x, food.y, 0);
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
    <Instances limit={foods.length}>
      <circleBufferGeometry args={[settings.food.size, 32]} />
      <meshBasicMaterial map={texture} />
      {foods.map((food, index) => {
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
