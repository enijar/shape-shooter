import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import server from "../../services/server";

const box = new THREE.Box3();

export default function useRotation(
  objectRef: React.MutableRefObject<THREE.Object3D>,
  enabled: boolean
) {
  const enabledRef = React.useRef(enabled);
  React.useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const { raycaster } = useThree();

  React.useEffect(() => {
    if (!enabled) return;

    function onMove() {
      if (!objectRef.current) return;
      if (!enabledRef.current) return;
      box.setFromObject(objectRef.current);
      const cX = (box.max.x + box.min.x) / 2;
      const cY = (box.max.y + box.min.y) / 2;
      const { x: oX, y: oY } = raycaster.ray.origin;
      const r = Math.atan2(oY - cY, oX - cX) - THREE.MathUtils.degToRad(90);
      server.emit("rotation", r);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, [raycaster, enabled]);

  return {
    enabled: enabledRef.current,
  };
}
