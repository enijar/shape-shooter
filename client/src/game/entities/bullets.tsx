import React from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import vars from "../../styles/vars";
import game from "../../shared/game/game";

const obj = new THREE.Object3D();

const MAX_BULLETS = 500;

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
    for (let i = game.players.length - 1; i >= 0; i--) {
      for (let j = 0; j < game.players[i].bullets.length; j++) {
        obj.scale.x = game.players[i].bullets[j].alive ? 1 : 0;
        obj.position.x = game.players[i].bullets[j].x;
        obj.position.y = game.players[i].bullets[j].y;
        obj.updateMatrix();
        mesh.current.setMatrixAt(index, obj.matrix);
        index++;
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, MAX_BULLETS]} />;
}
