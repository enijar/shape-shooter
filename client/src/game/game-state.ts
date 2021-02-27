import { PlayerData } from "@shape-shooter/shared";

export type GameState = {
  players: PlayerData[];
};

const gameState: GameState = {
  players: [],
};

export default gameState;
