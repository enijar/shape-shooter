import React from "react";
import { useStore } from "../store";
import { Scene } from "../types";
import PlayScene from "../scenes/play-scene/play-scene";

export default function SceneManager() {
  const { scene } = useStore();

  const SceneComponent = React.useMemo(() => {
    switch (scene) {
      case Scene.play:
        return PlayScene;
      default:
        return React.Fragment;
    }
  }, [scene]);

  return (
    <scene position={[0, 0, -100]}>
      <SceneComponent />
    </scene>
  );
}
