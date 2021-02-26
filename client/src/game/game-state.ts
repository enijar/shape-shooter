import { ModifierStatus, PlayerData } from "../shared/types";

export type GameState = {
  players: PlayerData[];
};

const gameState: GameState = {
  players: [],
};

export default gameState;
