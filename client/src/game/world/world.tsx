import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import vars from "../../styles/vars";
import assets from "../assets";
import useControls from "../hooks/use-controlls";

type Props = {
  children: any;
  size?: { w: number; h: number };
};

export default function World({ children, size = { w: 2, h: 2 } }: Props) {
  const texture = useTexture(assets.chunk);
  useControls();

  React.useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32 * size.w, 32 * size.h);
  }, [texture, size]);

  return (
    <group>
      <mesh position={[0, 0, -0.02]}>
        <planeBufferGeometry
          attach="geometry"
          args={[size.w, size.h, Math.max(1, size.w), Math.max(1, size.h)]}
        />
        <meshBasicMaterial attach="material" map={texture} transparent />
      </mesh>
      {children}
      <ambientLight color={vars.color.white} intensity={1} />
    </group>
  );
}
