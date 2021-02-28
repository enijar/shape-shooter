import create from "zustand";
import {
  ModifierData,
  PlayerData as Player,
  Shape,
} from "@shape-shooter/shared";
import { MODE } from "../config/consts";

type MapSize = {
  w: number;
  h: number;
};

type MapBounds = {
  x: { min: number; max: number };
  y: { min: number; max: number };
};

export type GameState = {
  modifiers: ModifierData[];
  name: string;
  shape: Shape;
  color: string;
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
  setName: (name: string) => void;
  setShape: (shape: Shape) => void;
  setModifiers: (modifiers: ModifierData[]) => void;
};

export const useGame = create<GameState>((set) => {
  return {
    modifiers: [],
    name: MODE === "dev" ? "Player 1" : "",
    shape: Shape.triangle,
    color: "#ff0000",
    mapBounds: {
      x: { min: -1, max: 1 },
      y: { min: -1, max: 1 },
    },
    mapSize: {
      w: 2,
      h: 2,
    },
    size: Math.max(window.innerWidth, window.innerHeight),
    zoom: 0.85,
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
    setName(name: string) {
      set({ name });
    },
    setShape(shape: Shape) {
      set({ shape });
    },
    setColor(color: string) {
      set({ color });
    },
    setModifiers(modifiers: ModifierData[]) {
      set({ modifiers });
    },
  };
});
