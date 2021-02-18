import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import vars from "../../styles/vars";
import assets from "../assets";
import { useFrame } from "react-three-fiber";
import { Controls } from "../../shared/types";
import useControls from "../hooks/use-controlls";
import { useGame } from "../state";

type Props = {
  children: any;
  size?: number;
};

export default function World({ children, size = 2 }: Props) {
  const { player } = useGame();

  const texture = useTexture(assets.chunk);
  const controls = useControls();

  React.useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32 * size, 32 * size);
  }, [texture, size]);

  useFrame(() => {
    if (player === null) return;
    const moveUp = controls[Controls.moveUp]();
    const moveDown = controls[Controls.moveDown]();
    const moveLeft = controls[Controls.moveLeft]();
    const moveRight = controls[Controls.moveRight]();

    let moveX: -1 | 0 | 1 = 0;
    let moveY: -1 | 0 | 1 = 0;

    if (moveUp) moveY = -1;
    if (moveDown) moveY = 1;
    if (moveLeft) moveX = -1;
    if (moveRight) moveX = 1;

    player.move(moveX, moveY);
    player.firing = controls.firing();
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
