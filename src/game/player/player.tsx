import React from "react";
import * as THREE from "three";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { useGame } from "../state";
import useControls from "../hooks/use-controls";
import shape from "../shape";
import { useThree } from "react-three-fiber";
import { deg2rad } from "../utils";

const box = new THREE.Box3();

export default function Player() {
  const playerGroup = React.useRef<THREE.Group>();
  const playerMesh = React.useRef<THREE.Mesh>();
  const [size, setSize] = React.useState<number>(0);
  const [zoom] = React.useState<number>(1);
  const { player } = useGame();
  const texture = useTexture(shape(player.shape, player.color));
  useControls();
  const { raycaster } = useThree();

  React.useEffect(() => {
    function onResize() {
      setSize(Math.max(window.innerWidth, window.innerHeight));
    }

    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  React.useEffect(() => {
    function onMove() {
      if (!playerMesh.current) return;
      if (!playerGroup.current || !playerMesh.current) return;
      box.setFromObject(playerGroup.current);
      const cX = (box.max.x + box.min.x) / 2;
      const cY = (box.max.y + box.min.y) / 2;
      const { x, y } = raycaster.ray.origin;
      playerMesh.current.rotation.z = Math.atan2(y - cY, x - cX) - deg2rad(90);
    }
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [raycaster]);

  return (
    <group
      ref={playerGroup}
      position={[player.position.x, player.position.y, 0]}
    >
      <mesh ref={playerMesh}>
        <planeBufferGeometry attach="geometry" args={[0.1, 0.1, 1]} />
        <meshBasicMaterial attach="material" map={texture} transparent />
      </mesh>
      <OrthographicCamera
        makeDefault
        position={[0, 0, size]}
        zoom={size * zoom}
      />
    </group>
  );
}
