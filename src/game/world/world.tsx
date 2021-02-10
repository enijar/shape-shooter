import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import vars from "../../styles/vars";
import assets from "../assets";

type Props = {
  children: any;
  size?: number;
};

export default function World({ children, size = 2 }: Props) {
  const texture = useTexture(assets.chunk);

  React.useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32 * size, 32 * size);
  }, [texture, size]);

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
