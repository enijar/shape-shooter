import React from "react";
import { settings } from "@app/shared";
import * as THREE from "three";

export default function Arena() {
  const texture = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 100;
    canvas.height = 100;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(
      settings.arena.size / canvas.width,
      settings.arena.size / canvas.height
    );
    return texture;
  }, []);

  return (
    <group position={[0, 0, -1]}>
      <mesh>
        <planeBufferGeometry
          args={[settings.arena.size, settings.arena.size]}
        />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
}
