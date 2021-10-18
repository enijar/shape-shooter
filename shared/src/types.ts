import { PlayerEntityData } from "./game/entities/player-entity";
import { AiMissileEntityData } from "./game/entities/ai-missile-entity";
import { BulletEntityData } from "./game/entities/bullet-entity";
import { ItemEntityData } from "./game/entities/item-entity";
import { FoodEntityData } from "./game/entities/food-entity";

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
  players: PlayerEntityData[];
  aiMissiles: AiMissileEntityData[];
  bullets: BulletEntityData[];
  items: ItemEntityData[];
  foods: FoodEntityData[];
};
