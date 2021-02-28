import React from "react";
import { ModifierStatus } from "@shape-shooter/shared";
import vars from "../../styles/vars";

type Props = {
  x: number;
  y: number;
  status: ModifierStatus;
};

export default function Modifier({ x, y, status }: Props) {
  return (
    <group position={[x, y, 0]}>
      <mesh>
        <sphereBufferGeometry attach="geometry" args={[0.005, 32, 32]} />
        <meshBasicMaterial
          attach="material"
          // @ts-ignore
          color={vars.color.modifiers[status].inner}
        />
      </mesh>
      <mesh>
        <sphereBufferGeometry attach="geometry" args={[0.009, 32, 32]} />
        <meshBasicMaterial
          attach="material"
          // @ts-ignore
          color={vars.color.modifiers[status].outer}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
