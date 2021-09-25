import create from "zustand";
import { Scene } from "./types";

type GameStore = {
  scene: Scene;
  setScene: (scene: Scene) => void;
};

export const useStore = create<GameStore>((set) => {
  return {
    // @todo change to Scene.setup
    scene: Scene.play,
    setScene(scene: Scene) {
      set({ scene });
    },
  };
});
