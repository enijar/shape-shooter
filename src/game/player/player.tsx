import React from "react";
import * as THREE from "three";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { useGame } from "../state";
import useControls from "../hooks/use-controls";
import shape from "../shape";
import { useFrame } from "react-three-fiber";

export default function Player() {
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
    if (!playerMesh.current) return;
    const { x, y } = state.raycaster.ray.origin;
    const angle = Math.atan2(x - (player.position.x/2), -(y - player.position.y));
    playerMesh.current.rotation.set(0, 0, angle);
    console.log(angle);
  });

  return (
    <group position={[player.position.x, player.position.y, 0]}>
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
