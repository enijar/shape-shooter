import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import vars from "../../styles/vars";
import assets from "../assets";
import { useFrame } from "react-three-fiber";
import engine from "../engine";
import { Controls } from "../types";
import { useGame } from "../state";
import useControls from "../hooks/use-controlls";

type Move = {
  axes: string[];
  amount: number;
};

type Props = {
  children: any;
  size?: number;
};

export default function World({ children, size = 2 }: Props) {
  const { setPlayer, setBullets } = useGame();
  const move = React.useRef<Move>({
    axes: [],
    amount: 0,
  });

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
    if (moveUp || moveRight) {
      move.current.amount = -1;
    }
    if (moveDown || moveLeft) {
      move.current.amount = 1;
    }
    if (moveLeft || moveRight) {
      move.current.axes.push("x");
    }
    if (moveUp || moveDown) {
      move.current.axes.push("y");
      if (moveLeft || moveRight) {
        move.current.amount *= 0.5;
      }
    }

    if (move.current.axes.length > 0) {
      setPlayer(engine.playerMove(move.current.axes, move.current.amount));
    }
    if (controls.shooting()) {
      setBullets(engine.playerShoot());
    }

    const { bullets } = engine.update();
    setBullets(bullets);

    move.current.axes = [];
    move.current.amount = 0;
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
