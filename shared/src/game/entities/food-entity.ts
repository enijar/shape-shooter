import { Box } from "../../types";
import settings from "../../settings";
import { fixDecimal, generateUUID, randInt } from "../../utils";

export class FoodEntityState {
  x: number = 0;
  y: number = 0;
}

export type FoodEntityData = [x: number, y: number];

export default class FoodEntity extends FoodEntityState {
  id: string;
  size: number = settings.food.size;
  box: Box;

  constructor() {
    super();
    this.id = generateUUID();
    this.x = randInt(settings.arena.size * -0.5, settings.arena.size * 0.5);
    this.y = randInt(settings.arena.size * -0.5, settings.arena.size * 0.5);
    this.box = {
      width: this.size,
      height: this.size,
      x: this.x,
      y: this.y,
    };
  }

  getData(): FoodEntityData {
    return [fixDecimal(this.x), fixDecimal(this.y)];
  }
}
