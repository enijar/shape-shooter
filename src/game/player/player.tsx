import React from "react";
import * as THREE from "three";
import { useThree } from "react-three-fiber";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { Shape } from "../types";
import { deg2rad } from "../utils";
import createShape from "../shape";
import { useGame } from "../state";
import engine from "../engine";

type Props = {
  id: string;
  position: number[];
  rotation: number[];
  shape: Shape;
  color: string;
  currentPlayer?: boolean;
};

export default function Player({
  id,
  position,
  rotation,
  shape,
  color,
  currentPlayer = false,
}: Props) {
  const texture = useTexture(createShape(shape, color));
  const { raycaster } = useThree();
  const { size, zoom } = useGame();
  const group = React.useRef<THREE.Group>();
  const mesh = React.useRef<THREE.Mesh>();
  const box = React.useMemo<THREE.Box3>(() => new THREE.Box3(), []);

  // Update current player's rotation
  React.useEffect(() => {
    if (!currentPlayer) return;

    function onMove() {
      if (!group.current || !mesh.current) return;
      box.setFromObject(group.current);
      const cX = (box.max.x + box.min.x) / 2;
      const cY = (box.max.y + box.min.y) / 2;
      const { x: oX, y: oY } = raycaster.ray.origin;
      const { players } = engine.getState();
      for (let i = 0, length = players.length; i < length; i++) {
        if (players[i].id === id) {
          let [x, y, z] = players[i].rotation;
          z = Math.atan2(oY - cY, oX - cX) - deg2rad(90);
          players[i].rotation = [x, y, z];
        }
      }
      engine.setState({ players });
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [raycaster, currentPlayer, id, box]);

  // Update player position
  React.useEffect(() => {
    if (!group.current) return;
    const [x, y, z] = position;
    group.current.position.set(x, y, z);
  }, [position]);

  // Update player rotation
  React.useEffect(() => {
    if (!mesh.current) return;
    const [x, y, z] = rotation;
    mesh.current.rotation.set(x, y, z);
  }, [rotation]);

  return (
    <group ref={group}>
      <mesh ref={mesh}>
        <planeBufferGeometry attach="geometry" args={[0.1, 0.1, 1]} />
        <meshBasicMaterial attach="material" map={texture} transparent />
      </mesh>
      {currentPlayer && (
        <OrthographicCamera
          makeDefault
          position={[0, 0, size]}
          zoom={size * zoom}
        />
      )}
    </group>
  );
}
