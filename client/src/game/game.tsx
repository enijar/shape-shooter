import React from "react";
import { Canvas } from "@react-three/fiber";
import Camera from "./globals/camera";
import Lights from "./globals/lights";
import SceneManager from "./managers/scene-manager";

export default function Game() {
  return (
    <Canvas>
      <Lights />
      <Camera />
      <SceneManager />
    </Canvas>
  );
}
