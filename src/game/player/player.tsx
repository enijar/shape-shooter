import React from "react";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import assets from "../assets";
import { useGame } from "../state";
import useControls from "../hooks/use-controls";
import vars from "../../styles/vars";

export default function Player() {
  const [size, setSize] = React.useState<number>(0);
  const [zoom] = React.useState<number>(1);
  const { player } = useGame();
  useControls();
  const texture = useTexture(assets.shapes[player.shape]);

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
        <meshBasicMaterial
          attach="material"
          map={texture}
          color={vars.color.healthBar}
          transparent={true}
        />
      </mesh>
      <OrthographicCamera makeDefault position={[0, 0, size]} zoom={size * zoom} />
    </group>
  );
}
