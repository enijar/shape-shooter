import React from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import { BulletType } from "@shape-shooter/shared";
import vars from "../../styles/vars";
import gameState from "../game-state";

function createBullets(
  type: BulletType,
  total: number = 500
): [THREE.BufferGeometry, THREE.MeshBasicMaterial, number] {
  if (type === BulletType.square) {
    const material = new THREE.MeshBasicMaterial();
    material.color = new THREE.Color(vars.color.bullets.square);
    const geometry = new THREE.BoxBufferGeometry(0.02, 0.02, 0.02);
    return [geometry, material, total];
  }
  if (type === BulletType.triangle) {
    const material = new THREE.MeshBasicMaterial();
    material.color = new THREE.Color(vars.color.bullets.triangle);
    const verticesOfCube = [
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      1,
      1,
      -1,
      1,
      1,
    ];
    const indicesOfFaces = [
      2,
      1,
      0,
      0,
      3,
      2,
      0,
      4,
      7,
      7,
      3,
      0,
      0,
      1,
      5,
      5,
      4,
      0,
      1,
      2,
      6,
      6,
      5,
      1,
      2,
      3,
      7,
      7,
      6,
      2,
      4,
      5,
      6,
      6,
      7,
      4,
    ];
    const geometry = new THREE.PolyhedronBufferGeometry(
      verticesOfCube,
      indicesOfFaces,
      0.02,
      1
    );
    return [geometry, material, total];
  }
  if (type === BulletType.ring) {
    const geometry = new THREE.RingBufferGeometry(0.005, 0.01, 32);
    const material = new THREE.MeshBasicMaterial();
    material.color = new THREE.Color(vars.color.bullets.ring);
    return [geometry, material, total];
  }
  const material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color(vars.color.bullets.circle);
  const geometry = new THREE.CircleBufferGeometry(0.01, 32);
  return [geometry, material, total];
}

const obj = new THREE.Object3D();

const MAX_BULLETS = {
  circles: 500,
  squares: 500,
  triangles: 500,
  rings: 500,
};

export default function Bullets() {
  const circles = React.useRef<THREE.InstancedMesh>();
  const squares = React.useRef<THREE.InstancedMesh>();
  const triangles = React.useRef<THREE.InstancedMesh>();
  const rings = React.useRef<THREE.InstancedMesh>();
  const circle = React.useMemo(
    () => createBullets(BulletType.circle, MAX_BULLETS.circles),
    []
  );
  const square = React.useMemo(
    () => createBullets(BulletType.square, MAX_BULLETS.squares),
    []
  );
  const triangle = React.useMemo(
    () => createBullets(BulletType.triangle, MAX_BULLETS.triangles),
    []
  );
  const ring = React.useMemo(
    () => createBullets(BulletType.ring, MAX_BULLETS.rings),
    []
  );

  useFrame(() => {
    if (
      !circles.current ||
      !squares.current ||
      !triangles.current ||
      !rings.current
    ) {
      return;
    }
    for (let i = 0; i < MAX_BULLETS.circles; i++) {
      obj.scale.x = 0;
      obj.updateMatrix();
      circles.current.setMatrixAt(i, obj.matrix);
    }
    for (let i = 0; i < MAX_BULLETS.squares; i++) {
      obj.scale.x = 0;
      obj.updateMatrix();
      squares.current.setMatrixAt(i, obj.matrix);
    }
    for (let i = 0; i < MAX_BULLETS.triangles; i++) {
      obj.scale.x = 0;
      obj.updateMatrix();
      triangles.current.setMatrixAt(i, obj.matrix);
    }
    for (let i = 0; i < MAX_BULLETS.rings; i++) {
      obj.scale.x = 0;
      obj.updateMatrix();
      rings.current.setMatrixAt(i, obj.matrix);
    }
    let index = 0;
    for (let i = gameState.players.length - 1; i >= 0; i--) {
      for (let j = 0; j < gameState.players[i].bullets.length; j++) {
        obj.scale.x = 1;
        obj.position.x = gameState.players[i].bullets[j].x;
        obj.position.y = gameState.players[i].bullets[j].y;
        obj.position.z = -0.01;
        obj.updateMatrix();
        if (gameState.players[i].bullets[j].type === BulletType.circle) {
          circles.current.setMatrixAt(index, obj.matrix);
        }
        if (gameState.players[i].bullets[j].type === BulletType.square) {
          squares.current.setMatrixAt(index, obj.matrix);
        }
        if (gameState.players[i].bullets[j].type === BulletType.triangle) {
          triangles.current.setMatrixAt(index, obj.matrix);
        }
        if (gameState.players[i].bullets[j].type === BulletType.ring) {
          rings.current.setMatrixAt(index, obj.matrix);
        }
        index++;
      }
    }
    circles.current.instanceMatrix.needsUpdate = true;
    squares.current.instanceMatrix.needsUpdate = true;
    triangles.current.instanceMatrix.needsUpdate = true;
    rings.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={circles} args={circle} />
      <instancedMesh ref={squares} args={square} />
      <instancedMesh ref={triangles} args={triangle} />
      <instancedMesh ref={rings} args={ring} />
    </>
  );
}
