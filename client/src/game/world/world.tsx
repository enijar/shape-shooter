import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import vars from "../../styles/vars";
import assets from "../assets";
import { useFrame } from "react-three-fiber";
import { Controls, GameActionType } from "../../shared/types";
import useControls from "../hooks/use-controlls";
import { useGame } from "../state";
import game from "../../shared/game/game";
import { deg2rad } from "../utils";

type Props = {
  children: any;
  size?: { w: number; h: number };
};

export default function World({ children, size = { w: 2, h: 2 } }: Props) {
  const { player } = useGame();

  const texture = useTexture(assets.chunk);
  const controls = useControls();

  React.useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32 * size.w, 32 * size.h);
  }, [texture, size]);

  useFrame(() => {
    if (player === null) return;
    const moveUp = controls[Controls.moveUp]();
    const moveDown = controls[Controls.moveDown]();
    const moveLeft = controls[Controls.moveLeft]();
    const moveRight = controls[Controls.moveRight]();
    const firing = controls.firing();

    let moveX: -1 | 0 | 1 = 0;
    let moveY: -1 | 0 | 1 = 0;

    if (moveUp) moveY = -1;
    if (moveDown) moveY = 1;
    if (moveLeft) moveX = -1;
    if (moveRight) moveX = 1;

    game.action(GameActionType.playerMove, {
      playerId: player.id,
      moveX,
      moveY,
    });

    if (player.firing !== firing) {
      game.action(GameActionType.playerFire, { playerId: player.id, firing });
    }
  });

  return (
    <group>
      <mesh>
        <planeBufferGeometry
          attach="geometry"
          args={[size.w, size.h, Math.max(1, size.w), Math.max(1, size.h)]}
        />
        <meshBasicMaterial attach="material" map={texture} />
      </mesh>
      {children}
      <ambientLight color={vars.color.white} intensity={1} />
    </group>
  );
}
