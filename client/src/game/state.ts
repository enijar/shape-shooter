import create from "zustand";
import { GameState, Player } from "../shared/types";

export const useGame = create<GameState>((set) => {
  return {
    size: Math.max(window.innerWidth, window.innerHeight),
    zoom: 1,
    playerId: -1,
    players: [],
    setPlayerId(playerId: number) {
      set({ playerId });
    },
    setPlayers(players: Player[]) {
      set({ players });
    },
    setSize(size: number) {
      set({ size });
    },
    setZoom(zoom: number) {
      set({ zoom });
    },
  };
});
