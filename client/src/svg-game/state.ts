import create from "zustand";
import { Player } from "./types";
import settings from "./settings";
import { clamp } from "./utils";

export enum Status {
  setup = "setup",
  play = "play",
}

export enum Action {
  up = "up",
  down = "down",
  left = "left",
  right = "right",
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
  action: (action: Action) => void;
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
    action(action: Action) {
      const { currentPlayer, players, zoom } = get();
      switch (action) {
        case Action.up:
          currentPlayer.y -= settings.player.speed;
          break;
        case Action.down:
          currentPlayer.y += settings.player.speed;
          break;
        case Action.left:
          currentPlayer.x -= settings.player.speed;
          break;
        case Action.right:
          currentPlayer.x += settings.player.speed;
          break;
      }
      currentPlayer.x = clamp(
        currentPlayer.x,
        0,
        100 - settings.player.size * zoom
      );
      currentPlayer.y = clamp(
        currentPlayer.y,
        0,
        100 - settings.player.size * zoom
      );
      for (let i = 0, length = players.length; i < length; i++) {
        if (players[i].id === currentPlayer.id) {
          players[i].x = parseFloat(currentPlayer.x.toFixed(2));
          players[i].y = parseFloat(currentPlayer.y.toFixed(2));
          break;
        }
      }
      set({ currentPlayer });
      set({ players });
    },
  };
});
