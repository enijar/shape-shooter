import { Box } from "../../types";
import settings from "../../settings";
import { generateUUID, randInt } from "../../utils";

export default class FoodEntity {
  id: string;
  x: number = 0;
  y: number = 0;
  rotation = 0;
  size: number = settings.food.size;
  box: Box;

  constructor() {
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
}
