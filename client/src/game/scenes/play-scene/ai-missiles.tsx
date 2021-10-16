import React from "react";
import { settings } from "@app/shared";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import { useFrame } from "@react-three/fiber";
import gameState from "../../game-state";
import { encodeSvg } from "../../utils";
import { Mesh } from "three";

const SIZE = settings.ai.missile.size;

const maxAiMissiles = 500;
const aiMissiles = Array.from({ length: maxAiMissiles });

function AiMissiles() {
  const instanceRefs = React.useRef<Position[]>([]);
  const healthBarRefs = React.useRef<Mesh[]>([]);

  useFrame(() => {
    for (let i = 0; i < maxAiMissiles; i++) {
      if (!instanceRefs.current[i]) continue;
      if (!gameState.aiMissiles[i]) {
        instanceRefs.current[i].scale.setScalar(0);
        continue;
      }
      instanceRefs.current[i].scale.setScalar(1);
      instanceRefs.current[i].rotation.z = gameState.aiMissiles[i].rotation;
      instanceRefs.current[i].color.set(gameState.aiMissiles[i].color);
      instanceRefs.current[i].position.set(
        gameState.aiMissiles[i].x,
        gameState.aiMissiles[i].y,
        0
      );

      // Health
      const health =
        (1 / gameState.aiMissiles[i].maxHealth) *
        gameState.aiMissiles[i].health;
      healthBarRefs.current[i].scale.x = health;
      healthBarRefs.current[i].position.x = -SIZE * (1 - health) * 0.5;
    }
  });

  const texture = useTexture(
    encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <polygon points="${SIZE * 0.5},0 0,${SIZE} ${SIZE},${SIZE}" fill="white"/>
</svg>`
    )
  );

  return (
    <Instances limit={maxAiMissiles} range={maxAiMissiles}>
      <planeBufferGeometry args={[SIZE, SIZE]} />
      <meshBasicMaterial map={texture} transparent />
      {aiMissiles.map((_, index) => {
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
