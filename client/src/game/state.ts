import create from "zustand";
import { Bullet, GameState, Player } from "../shared/types";

export const useGame = create<GameState>((set) => {
  return {
    size: Math.max(window.innerWidth, window.innerHeight),
    zoom: 1,
    player: null,
    players: [],
    bullets: [],
    currentPlayerId: "",
    setCurrentPlayerId(currentPlayerId: string) {
      set({ currentPlayerId });
    },
    setPlayer(player: Player) {
      set({ player });
    },
    setPlayers(players: Player[]) {
      set({ players });
    },
    setBullets(bullets: Bullet[]) {
      set({ bullets });
    },
    setSize(size: number) {
      set({ size });
    },
    setZoom(zoom: number) {
      set({ zoom });
    },
  };
});
