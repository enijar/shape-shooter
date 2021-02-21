import React from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import vars from "../../styles/vars";
import { useGame } from "../state";

const obj = new THREE.Object3D();

const MAX_BULLETS = 500;

export default function Bullets() {
  const { instance } = useGame();
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
    for (let i = instance.players.length - 1; i >= 0; i--) {
      for (let j = 0; j < instance.players[i].bullets.length; j++) {
        obj.scale.x = instance.players[i].bullets[j].alive ? 1 : 0;
        obj.position.x = instance.players[i].bullets[j].x;
        obj.position.y = instance.players[i].bullets[j].y;
        obj.updateMatrix();
        mesh.current.setMatrixAt(index, obj.matrix);
        index++;
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, MAX_BULLETS]} />;
}
