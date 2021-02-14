import React from "react";
import * as THREE from "three";
import { Bullet as BulletType } from "../types";
import vars from "../../styles/vars";

type Props = {
  bullet: BulletType;
  currentPlayer?: boolean;
};

export default function Bullet({ bullet }: Props) {
  const group = React.useRef<THREE.Group>();
  const mesh = React.useRef<THREE.Mesh>();

  return (
    <group ref={group} rotation={bullet.rotation} position={bullet.position}>
      <mesh ref={mesh}>
        <circleBufferGeometry attach="geometry" args={[0.01, 32]} />
        <meshBasicMaterial attach="material" color={vars.color.black} />
      </mesh>
    </group>
  );
}
