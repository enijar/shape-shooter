import create from "zustand";
import Player from "../shared/game/entities/player";

type MapSize = {
  w: number;
  h: number;
};

type MapBounds = {
  x: { min: number; max: number };
  y: { min: number; max: number };
};

export type GameState = {
  mapSize: MapSize;
  mapBounds: MapBounds;
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
  setMapSize: (mapSize: MapSize) => void;
  setMapBounds: (mapBounds: MapBounds) => void;
};

export const useGame = create<GameState>((set) => {
  return {
    mapBounds: {
      x: { min: -1, max: 1 },
      y: { min: -1, max: 1 },
    },
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
    setMapSize(mapSize: MapSize) {
      set({ mapSize });
    },
    setMapBounds(mapBounds: MapBounds) {
      set({ mapBounds });
    },
  };
});
