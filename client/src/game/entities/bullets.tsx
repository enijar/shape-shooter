import React from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import vars from "../../styles/vars";
import gameState from "../game-state";

const obj = new THREE.Object3D();

const MAX_BULLETS = 500;

export default function Bullets() {
  const mesh = React.useRef<THREE.InstancedMesh>();
  const geometry = React.useMemo<THREE.CircleGeometry>(() => {
    return new THREE.CircleGeometry(0.01, 32);
  }, []);
  const material = React.useMemo<THREE.MeshBasicMaterial>(() => {
    const material = new THREE.MeshBasicMaterial();
    material.color = new THREE.Color(vars.color.white);
    return material;
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    for (let i = 0; i < MAX_BULLETS; i++) {
      obj.scale.x = 0;
      obj.updateMatrix();
      mesh.current.setMatrixAt(i, obj.matrix);
    }
    let index = 0;
    for (let i = gameState.players.length - 1; i >= 0; i--) {
      for (let j = 0; j < gameState.players[i].bullets.length; j++) {
        obj.scale.x = 1;
        obj.position.x = gameState.players[i].bullets[j].x;
        obj.position.y = gameState.players[i].bullets[j].y;
        obj.updateMatrix();
        mesh.current.setMatrixAt(index, obj.matrix);
        index++;
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, MAX_BULLETS]} />;
}
