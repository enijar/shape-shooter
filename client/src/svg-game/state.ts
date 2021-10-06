import create from "zustand";
import { Player } from "./types";
import settings from "./settings";

export enum Status {
  setup = "setup",
  play = "play",
}

type StateValues = {
  status: Status;
  currentPlayer: Player;
  players: Player[];
  zoom: number;
};

export type State = StateValues & {
  setStatus: (status: Status) => void;
  setCurrentPlayer: (currentPlayer: Player) => void;
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  setZoom: (zoom: number) => void;
};

export const INITIAL_STATE: StateValues = {
  status: Status.setup,
  currentPlayer: null,
  players: [],
  zoom: 100 / settings.arena.size,
};

export const useState = create<State>((set, get) => {
  return {
    status: INITIAL_STATE.status,
    setStatus(status: Status) {
      set({ status });
    },
    currentPlayer: INITIAL_STATE.currentPlayer,
    setCurrentPlayer(currentPlayer: Player) {
      set({ currentPlayer });
    },
    players: [...INITIAL_STATE.players],
    setPlayers(players: Player[]) {
      set({ players });
    },
    addPlayer(player: Player) {
      // Only add player if not already in players[]
      const { players } = get();
      if (players.find(({ id }) => id === player.id) !== undefined) return;
      players.push(player);
      set({ players });
    },
    zoom: INITIAL_STATE.zoom,
    setZoom(zoom: number) {
      set({ zoom });
    },
  };
});
