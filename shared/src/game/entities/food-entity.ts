import { Box } from "../../types";
import settings from "../../settings";
import { fixDecimal, generateUUID, randInt } from "../../utils";

export class FoodEntityData {
  x: number = 0;
  y: number = 0;
  rotation = 0;
}

export default class FoodEntity extends FoodEntityData {
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
    return {
      x: fixDecimal(this.x),
      y: fixDecimal(this.y),
      rotation: fixDecimal(this.rotation),
    };
  }
}
