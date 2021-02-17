import React from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import vars from "../../styles/vars";
import engine from "../../shared/game/engine";

const obj = new THREE.Object3D();

export default function Bullets() {
  const mesh = React.useRef<THREE.InstancedMesh>();
  const geometry = React.useMemo<THREE.CircleGeometry>(() => {
    return new THREE.CircleGeometry(0.01, 32);
  }, []);
  const material = React.useMemo<THREE.MeshBasicMaterial>(() => {
    const material = new THREE.MeshBasicMaterial();
    material.color = new THREE.Color(vars.color.black);
    return material;
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    for (let i = 0, iLength = engine.state.bullets.length; i < iLength; i++) {
      obj.scale.x = engine.state.bullets[i].id === -1 ? 0 : 1;
      obj.position.x = engine.state.bullets[i].x;
      obj.position.y = engine.state.bullets[i].y;
      obj.updateMatrix();
      mesh.current.setMatrixAt(i, obj.matrix.clone());
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, engine.state.bullets.length]}
    />
  );
}
