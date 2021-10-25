import React from "react";
import { GameState, settings } from "@app/shared";
import { InstancedMesh, Mesh } from "three";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import { encodeSvg } from "../../utils";
import useSubscription from "../../hooks/use-subscription";
import { Subscription } from "../../types";
import { ENTITIES, MAX_ENTITIES } from "../../consts";

const SIZE = settings.ai.missile.size;

function AiMissiles() {
  const instancesRef = React.useRef<InstancedMesh>();
  const instanceRefs = React.useRef<Position[]>([]);
  const healthBarRefs = React.useRef<Mesh[]>([]);

  useSubscription(
    Subscription.entityTick,
    (i: number, gameState: GameState) => {
      instancesRef.current.count = gameState.aiMissiles.length;
      if (!instanceRefs.current[i]) return;
      if (!gameState.aiMissiles[i]) {
        return instanceRefs.current[i].scale.setScalar(0);
      }
      instanceRefs.current[i].scale.setScalar(1);
      instanceRefs.current[i].rotation.z = gameState.aiMissiles[i][2];
      instanceRefs.current[i].color.set(settings.ai.missile.color);
      instanceRefs.current[i].position.set(
        gameState.aiMissiles[i][0],
        gameState.aiMissiles[i][1],
        0
      );

      // Health
      const updatedHealth =
        (1 / settings.ai.missile.maxHealth) * gameState.aiMissiles[i][3];
      healthBarRefs.current[i].scale.x = updatedHealth;
      healthBarRefs.current[i].position.x = -SIZE * (1 - updatedHealth) * 0.5;
    }
  );

  const texture = useTexture(
    encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <polygon points="${SIZE * 0.5},0 0,${SIZE} ${SIZE},${SIZE}" fill="white"/>
</svg>`
    )
  );

  return (
    <Instances ref={instancesRef} limit={MAX_ENTITIES} range={0}>
      <planeBufferGeometry args={[SIZE, SIZE]} />
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
          >
            <mesh position={[0, -SIZE, -0.01]}>
              <planeBufferGeometry args={[SIZE, 2.5]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh
              position={[0, -SIZE, 0]}
              ref={(ref) => {
                healthBarRefs.current[index] = ref as Mesh;
              }}
            >
              <planeBufferGeometry args={[SIZE, 2.5]} />
              <meshBasicMaterial color="hsl(120, 83%, 37%)" />
            </mesh>
          </Instance>
        );
      })}
    </Instances>
  );
}

export default React.memo(AiMissiles);
