import PlayerEntity from "./game/entities/player-entity";
import BulletEntity from "./game/entities/bullet-entity";
import ItemEntity from "./game/entities/item-entity";

export enum Action {
  up = "up",
  down = "down",
  left = "left",
  right = "right",
}

export type Box = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type Game = {
  arenaSize: number;
};

export type GameState = {
  players: PlayerEntity[];
  bullets: BulletEntity[];
  items: ItemEntity[];
};
