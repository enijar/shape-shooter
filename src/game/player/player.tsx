import React from "react";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import assets from "../assets";
import { useGame } from "../state";
import useControls from "../hooks/use-controls";
import vars from "../../styles/vars";

export default function Player() {
  const [size, setSize] = React.useState<number>(0);
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
        <planeBufferGeometry attach="geometry" args={[0.2, 0.2, 1]} />
        <meshBasicMaterial
          attach="material"
          color={vars.color.black}
          map={texture}
        />
      </mesh>
      <OrthographicCamera makeDefault position={[0, 0, size]} zoom={size} />
    </group>
  );
}
