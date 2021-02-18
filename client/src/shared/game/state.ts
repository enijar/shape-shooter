import Player from "./entities/player";

export type GameEngineState = {
  totalBullets: number;
  totalPlayers: number;
  players: Player[];
};

const state: GameEngineState = {
  totalBullets: 0,
  totalPlayers: 0,
  players: [],
};

export default state;
