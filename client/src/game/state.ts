import create from "zustand";
import { EnginePlayer } from "../shared/game/engine";

export type GameState = {
  player: null | EnginePlayer;
  setPlayer: (player: null | EnginePlayer) => void;
  players: EnginePlayer[];
  setPlayers: (players: EnginePlayer[]) => void;
  size: number;
  setSize: (size: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
};

export const useGame = create<GameState>((set) => {
  return {
    size: Math.max(window.innerWidth, window.innerHeight),
    zoom: 1,
    player: null,
    players: [],
    setPlayer(player: null | EnginePlayer) {
      set({ player });
    },
    setPlayers(players: EnginePlayer[]) {
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
