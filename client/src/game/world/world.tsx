import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import vars from "../../styles/vars";
import assets from "../assets";
import { useFrame } from "react-three-fiber";
import { Controls, EngineActionType } from "../../shared/types";
import useControls from "../hooks/use-controlls";
import { useGame } from "../state";
import engine from "../../shared/game/engine";

type Props = {
  children: any;
  size?: number;
};

export default function World({ children, size = 2 }: Props) {
  const { playerId } = useGame();

  const texture = useTexture(assets.chunk);
  const controls = useControls();

  React.useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32 * size, 32 * size);
  }, [texture, size]);

  useFrame(() => {
    const moveUp = controls[Controls.moveUp]();
    const moveDown = controls[Controls.moveDown]();
    const moveLeft = controls[Controls.moveLeft]();
    const moveRight = controls[Controls.moveRight]();
    const shooting = controls.shooting();

    if (moveUp || moveDown || moveRight || moveLeft) {
      engine.emit(EngineActionType.move, {
        playerId,
        x: moveLeft ? 1 : moveRight ? -1 : 0,
        y: moveUp ? -1 : moveDown ? 1 : 0,
      });
    }

    if (shooting) {
      //
    }
  });

  return (
    <group>
      <mesh>
        <planeBufferGeometry attach="geometry" args={[size, size, size]} />
        <meshBasicMaterial attach="material" map={texture} />
      </mesh>
      {children}
      <ambientLight color={vars.color.white} intensity={1} />
    </group>
  );
}
