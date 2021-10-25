import React from "react";
import { settings } from "@app/shared";
import { InstancedMesh, Mesh } from "three";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import gameState from "../../game-state";
import { encodeSvg } from "../../utils";
import { ENTITIES, MAX_ENTITIES } from "../../consts";
import useSubscription from "../../hooks/use-subscription";
import { Subscription } from "../../types";

const SIZE = settings.item.size;

function Items() {
  const instancesRef = React.useRef<InstancedMesh>();
  const instanceRefs = React.useRef<Position[]>([]);
  const healthBarRefs = React.useRef<Mesh[]>([]);

  useSubscription(Subscription.tick, (i: number) => {
    instancesRef.current.count = gameState.items.length;
    if (!instanceRefs.current[i]) return;
    if (!gameState.items[i]) {
      return instanceRefs.current[i].scale.setScalar(0);
    }
    instanceRefs.current[i].scale.setScalar(1);
    instanceRefs.current[i].position.set(
      gameState.items[i][0],
      gameState.items[i][1],
      0
    );
    instanceRefs.current[i].color.setStyle(gameState.items[i][3]);

    // Health
    const updatedHealth = (1 / settings.item.maxHealth) * gameState.items[i][2];
    healthBarRefs.current[i].scale.x = updatedHealth;
    healthBarRefs.current[i].position.x = SIZE * -2 * (1 - updatedHealth) * 0.5;
  });

  const texture = useTexture(
    encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="10" height="10">
<circle cx="${SIZE * 0.5}" cy="${SIZE * 0.5}" r="${SIZE * 0.5}" fill="white"/>
</svg>`
    )
  );

  return (
    <Instances ref={instancesRef} limit={MAX_ENTITIES} range={0}>
      <circleBufferGeometry args={[SIZE, 32, 32]} />
      <meshBasicMaterial map={texture} />
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
