import create from "zustand";
import Player from "../shared/game/entities/player";
import Game from "../shared/game/game";

export type GameState = {
  player: Player | null;
  setPlayer: (player: Player | null) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  size: number;
  setSize: (size: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  instance: Game;
};

export const useGame = create<GameState>((set) => {
  return {
    size: Math.max(window.innerWidth, window.innerHeight),
    zoom: 1,
    player: null,
    players: [],
    instance: new Game(),
    setPlayer(player: Player | null) {
      set({ player });
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
