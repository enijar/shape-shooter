import React from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import vars from "../../styles/vars";
import state from "../../shared/game/state";

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
    let index = 0;
    for (let i = state.players.length - 1; i >= 0; i--) {
      for (let j = state.players[i].bullets.length - 1; j >= 0; j--) {
        obj.position.x = state.players[i].bullets[j].x;
        obj.position.y = state.players[i].bullets[j].y;
        obj.updateMatrix();
        mesh.current.setMatrixAt(index, obj.matrix.clone());
        index++;
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, 10000]} />;
}
