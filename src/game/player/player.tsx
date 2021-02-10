import React from "react";
import * as THREE from "three";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { useGame } from "../state";
import useControls from "../hooks/use-controls";
import shape from "../shape";
import { useFrame } from "react-three-fiber";
import { deg2rad } from "../utils";

export default function Player() {
  const box = React.useMemo<THREE.Box3>(() => new THREE.Box3(), []);
  const playerGroup = React.useRef<THREE.Group>();
  const playerMesh = React.useRef<THREE.Mesh>();
  const [size, setSize] = React.useState<number>(0);
  const [zoom] = React.useState<number>(1);
  const { player } = useGame();
  const texture = useTexture(shape(player.shape, player.color));
  useControls();

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

  useFrame((state) => {
    if (!playerGroup.current || !playerMesh.current) return;
    box.setFromObject(playerGroup.current);
    const cX = (box.max.x + box.min.x) / 2;
    const cY = (box.max.y + box.min.y) / 2;
    const { x, y } = state.raycaster.ray.origin;
    playerMesh.current.rotation.z = Math.atan2(y - cY, x - cX) - deg2rad(90);
  });

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
