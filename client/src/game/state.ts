import create from "zustand";
import Player from "../shared/game/entities/player";
import Game from "../shared/game/game";
import { GameContext } from "../shared/types";

export type GameState = {
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;
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
    currentPlayer: null,
    players: [],
    instance: new Game(GameContext.client),
    setCurrentPlayer(currentPlayer: Player | null) {
      set({ currentPlayer });
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
