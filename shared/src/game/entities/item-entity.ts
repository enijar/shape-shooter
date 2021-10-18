import { Box } from "../../types";
import settings from "../../settings";
import { fixDecimal, generateUUID, randInt } from "../../utils";

export class ItemEntityData {
  x: number = 0;
  y: number = 0;
  rotation = 0;
  health: number = 0;
  color: string = "";
  maxHealth: number = settings.item.maxHealth;
}

export default class ItemEntity extends ItemEntityData {
  id: string;
  size: number = settings.item.size;
  box: Box;

  constructor() {
    super();
    this.id = generateUUID();
    this.x = randInt(settings.arena.size * -0.5, settings.arena.size * 0.5);
    this.y = randInt(settings.arena.size * -0.5, settings.arena.size * 0.5);
    this.box = {
      width: this.size * 2,
      height: this.size * 2,
      x: this.x,
      y: this.y,
    };
    this.color = `hsl(${randInt(1, 360)}, 50%, 50%)`;
    this.health = this.maxHealth;
  }

  getData(): ItemEntityData {
    return {
      x: fixDecimal(this.x),
      y: fixDecimal(this.y),
      rotation: fixDecimal(this.rotation),
      health: fixDecimal(this.health),
      color: this.color,
      maxHealth: this.maxHealth,
    };
  }
}
