import create from "zustand";
import { Scene } from "./types";
import { PlayerEntityData } from "@app/shared";

type GameStore = {
  scene: Scene;
  setScene: (scene: Scene) => void;
  players: PlayerEntityData[];
  setPlayers: (players: PlayerEntityData[]) => void;
  currentPlayer: PlayerEntityData;
  setCurrentPlayer: (currentPlayer: PlayerEntityData) => void;
};

export const useStore = create<GameStore>((set) => {
  return {
    // @todo change to Scene.setup
    scene: Scene.play,
    setScene(scene: Scene) {
      set({ scene });
    },
    players: [],
    setPlayers(players: PlayerEntityData[]) {
      set({ players });
    },
    currentPlayer: null,
    setCurrentPlayer(currentPlayer?: PlayerEntityData) {
      set({ currentPlayer });
    },
  };
});
