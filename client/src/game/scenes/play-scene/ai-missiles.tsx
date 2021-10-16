import React from "react";
import { settings } from "@app/shared";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { Position } from "@react-three/drei/helpers/Position";
import { useFrame } from "@react-three/fiber";
import gameState from "../../game-state";
import { encodeSvg } from "../../utils";

const SIZE = settings.ai.missile.size;

const maxAiMissiles = 500;
const aiMissiles = Array.from({ length: maxAiMissiles });

function AiMissiles() {
  const instanceRefs = React.useRef<Position[]>([]);

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
          />
        );
      })}
    </Instances>
  );
}

export default React.memo(AiMissiles);
