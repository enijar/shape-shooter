import React from "react";
import * as THREE from "three";
import vars from "../../styles/vars";
import {
  bulletEntities,
  BulletEntityAttributeIndex,
} from "../../shared/game/engine";
import engine from "../../shared/game/engine";
import { useFrame } from "react-three-fiber";

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
    for (
      let i = 0, length = engine.state.bullets.length;
      i < length;
      i += bulletEntities.totalAttributes
    ) {
      obj.position.x = bulletEntities.get(i, BulletEntityAttributeIndex.x);
      obj.position.y = bulletEntities.get(i, BulletEntityAttributeIndex.y);
      obj.scale.x = bulletEntities.get(i, BulletEntityAttributeIndex.active)
        ? 1
        : 0;
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
