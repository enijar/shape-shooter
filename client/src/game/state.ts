import create from "zustand";
import { GameState } from "../shared/types";

export const useGame = create<GameState>((set) => {
  return {
    size: Math.max(window.innerWidth, window.innerHeight),
    zoom: 1,
    playerId: -1,
    playerIds: [],
    setPlayerId(playerId: number) {
      set({ playerId });
    },
    setPlayerIds(playerIds: number[]) {
      set({ playerIds });
    },
    setSize(size: number) {
      set({ size });
    },
    setZoom(zoom: number) {
      set({ zoom });
    },
  };
});
