import create from "zustand";
import { Scene } from "./types";
import { PlayerEntity } from "@app/shared";

type GameStore = {
  scene: Scene;
  setScene: (scene: Scene) => void;
  players: PlayerEntity[];
  setPlayers: (players: PlayerEntity[]) => void;
  currentPlayer: PlayerEntity;
  setCurrentPlayer: (currentPlayer: PlayerEntity) => void;
};

export const useStore = create<GameStore>((set) => {
  return {
    // @todo change to Scene.setup
    scene: Scene.play,
    setScene(scene: Scene) {
      set({ scene });
    },
    players: [],
    setPlayers(players: PlayerEntity[]) {
      set({ players });
    },
    currentPlayer: null,
    setCurrentPlayer(currentPlayer?: PlayerEntity) {
      set({ currentPlayer });
    },
  };
});
