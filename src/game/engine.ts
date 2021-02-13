import { merge } from "lodash";
import { Player, Shape, Weapon } from "./types";
import { guid } from "./utils";
import { useGame } from "./state";

export type EngineState = {
  createdAt: number;
  currentPlayerId: string;
  players: Player[];
};

export enum GameEngineContext {
  server = "server",
  client = "client",
}

let state: EngineState = {
  createdAt: Date.now(),
  currentPlayerId: "",
  players: [
    {
      id: guid(),
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      health: 0.8,
      speed: 0.005,
      name: "Enijar",
      shape: Shape.triangle,
      weapon: Weapon.handgun,
      color: "#ff0000",
      shootingSpeed: 0.75,
      bullets: [],
    },
    {
      id: guid(),
      position: [0.15, 0.3, 0],
      rotation: [0, 0, 0],
      health: 1,
      speed: 0.005,
      name: "Player 2",
      shape: Shape.triangle,
      weapon: Weapon.handgun,
      color: "#00ff00",
      shootingSpeed: 0.75,
      bullets: [],
    },
  ],
};

let nextFrame: number = -1;

const engine = {
  context: GameEngineContext.client,
  destroy() {
    cancelAnimationFrame(nextFrame);
  },
  getState(): EngineState {
    return state;
  },
  setState(partialState: any) {
    merge(state, partialState);

    if (this.context === GameEngineContext.client) {
      const game = useGame.getState();
      game.setPlayers(state.players);
      game.setCurrentPlayerId(state.currentPlayerId);
    }
  },
  start() {
    (function update() {
      nextFrame = requestAnimationFrame(update);
    })();
  },
};

export default engine;
