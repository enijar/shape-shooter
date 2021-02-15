import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import vars from "../../styles/vars";
import assets from "../assets";
import { useFrame } from "react-three-fiber";
import engine from "../../shared/game/engine";
import { Controls, Move } from "../../shared/types";
import useControls from "../hooks/use-controlls";
import { useGame } from "../state";

type Props = {
  children: any;
  size?: number;
};

export default function World({ children, size = 2 }: Props) {
  const { player } = useGame();
  const move = React.useRef<Move>({
    x: {
      move: false,
      amount: 0,
    },
    y: {
      move: false,
      amount: 0,
    },
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

    if (moveUp) {
      move.current.y.move = true;
      move.current.y.amount = -1;
    }
    if (moveDown) {
      move.current.y.move = true;
      move.current.y.amount = 1;
    }
    if (moveLeft) {
      move.current.x.move = true;
      move.current.x.amount = 1;
    }
    if (moveRight) {
      move.current.x.move = true;
      move.current.x.amount = -1;
    }

    if (move.current.x.move || move.current.y.move) {
      engine.action({
        playerId: player?.id ?? -1,
        type: "move",
        payload: move.current,
      });
    }
    if (controls.shooting()) {
      engine.action({
        playerId: player?.id ?? -1,
        type: "shoot",
        payload: {},
      });
    }

    move.current.x.move = false;
    move.current.y.move = false;

    engine.update();
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
