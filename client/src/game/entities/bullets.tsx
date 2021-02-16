import React from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import vars from "../../styles/vars";
import engine from "../../shared/game/engine";
import { useGame } from "../state";

const obj = new THREE.Object3D();

export default function Bullets() {
  const { players } = useGame();
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
    for (let i = 0, iLength = players.length; i < iLength; i++) {
      if (players[i].id === -1) continue;
      for (let j = 0, jLength = players[i].bullets.length; j < jLength; j++) {
        if (players[i].bullets[j].id === -1) continue;
        obj.position.x = players[i].bullets[j].x;
        obj.position.y = players[i].bullets[j].y;
        obj.updateMatrix();
        mesh.current.setMatrixAt(i, obj.matrix.clone());
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, engine.totalPlayerBullets]}
    />
  );
}
