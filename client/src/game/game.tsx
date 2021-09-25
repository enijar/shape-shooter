import React from "react";
import { Canvas } from "@react-three/fiber";
import { Action } from "@app/shared";
import Camera from "./globals/camera";
import Lights from "./globals/lights";
import Actions from "./globals/actions";
import SceneManager from "./managers/scene-manager";

export default function Game() {
  return (
    <Canvas>
      <Lights />
      <Camera />
      <Actions
        keyMap={{
          w: Action.up,
          s: Action.down,
          a: Action.left,
          d: Action.right,
        }}
      />
      <SceneManager />
    </Canvas>
  );
}
