import React from "react";
import { PlayerEntity, settings } from "@app/shared";
import { Color, Vector3, Euler } from "three";
import { Instance, Instances, useTexture } from "@react-three/drei";
import server from "../../../services/server";
import { Position } from "@react-three/drei/helpers/Position";
import { useFrame } from "@react-three/fiber";
import gameState from "../../game-state";
import { encodeSvg } from "../../utils";

type BulletState = {
  id?: string;
  playerId?: string;
  color: Color;
  position: Vector3;
  rotation: Euler;
};

const SIZE = settings.bullet.size;

const bullets: BulletState[] = Array.from({ length: 100 }).map(() => {
  return {
    color: new Color("#ffffff"),
    position: new Vector3(0, 0, 0),
    rotation: new Euler(0, 0, 0),
  };
});

type Props = {
  currentPlayer?: PlayerEntity;
};

export default function Bullets({ currentPlayer }: Props) {
  const instanceRefs = React.useRef<Position[]>([]);

  useFrame(() => {
    for (let i = 0, length = bullets.length; i < length; i++) {
      if (!instanceRefs.current[i]) continue;
      if (!gameState.bullets[i]) {
        instanceRefs.current[i].scale.x = 0;
        continue;
      }
      instanceRefs.current[i].scale.x = 1;
      instanceRefs.current[i].rotateZ(gameState.bullets[i].rotation);
      instanceRefs.current[i].color.set(gameState.bullets[i].color);
      instanceRefs.current[i].position.set(
        gameState.bullets[i].x,
        gameState.bullets[i].y,
        0
      );
    }
  });

  React.useEffect(() => {
    if (currentPlayer === null) return;
    let shooting = false;

    function shoot() {
      shooting = !shooting;
      server.emit("shooting", shooting);
    }

    window.addEventListener("pointerdown", shoot);
    window.addEventListener("pointerup", shoot);
    return () => {
      window.removeEventListener("pointerdown", shoot);
      window.removeEventListener("pointerup", shoot);
    };
  }, [currentPlayer]);

  const texture = useTexture(
    encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
<circle cx="${SIZE * 0.5}" cy="${SIZE * 0.5}" r="${SIZE * 0.5}" fill="white"/>
</svg>`
    )
  );

  return (
    <Instances limit={bullets.length}>
      <circleBufferGeometry args={[settings.bullet.size, 32]} />
      <meshBasicMaterial map={texture} />
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
