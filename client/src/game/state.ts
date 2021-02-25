import create from "zustand";
import Player from "../shared/game/entities/player";

export type GameState = {
  mapSize: {
    w: number;
    h: number;
  };
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;
  players: Player[];
  socket: null | SocketIOClient.Socket;
  setPlayers: (players: Player[]) => void;
  size: number;
  setSize: (size: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  setSocket: (socket: SocketIOClient.Socket | null) => void;
};

export const useGame = create<GameState>((set) => {
  return {
    mapSize: {
      w: 2,
      h: 2,
    },
    size: Math.max(window.innerWidth, window.innerHeight),
    zoom: 1,
    currentPlayer: null,
    players: [],
    socket: null,
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
    setSocket(socket: SocketIOClient.Socket | null) {
      set({ socket });
    },
  };
});
