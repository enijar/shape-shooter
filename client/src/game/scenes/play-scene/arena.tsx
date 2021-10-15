import React from "react";
import { settings } from "@app/shared";
import { CanvasTexture, RepeatWrapping } from "three";

export default function Arena() {
  const texture = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 100;
    canvas.height = 100;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    const texture = new CanvasTexture(canvas);
    texture.wrapT = RepeatWrapping;
    texture.wrapS = RepeatWrapping;
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
