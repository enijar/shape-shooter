import React from "react";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { useGame } from "../state";
import useControls from "../hooks/use-controls";
import shape from "../shape";

export default function Player() {
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

  return (
    <group position={[player.position.x, player.position.y, 0]}>
      <mesh>
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
