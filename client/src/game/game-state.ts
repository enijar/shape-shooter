import { Shape } from "../shared/types";

export type GameState = {
  players: {
    id: number;
    name: string;
    shape: Shape;
    color: string;
    hp: number;
    x: number;
    y: number;
    r: number;
    bullets: {
      x: number;
      y: number;
    }[];
  }[];
};

const gameState: GameState = {
  players: [],
};

export default gameState;
