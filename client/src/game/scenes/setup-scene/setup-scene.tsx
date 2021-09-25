import React from "react";
import { Html } from "@react-three/drei";
import { SetupSceneWrapper } from "../../styles";

export default function SetupScene() {
  return (
    <group>
      <Html fullscreen>
        <SetupSceneWrapper>
          <h1>Setup Your Player</h1>
        </SetupSceneWrapper>
      </Html>
    </group>
  );
}
