import { Box } from "../../types";
import settings from "../../settings";
import { fixDecimal, generateUUID, randInt } from "../../utils";

export class ItemEntityState {
  x: number = 0;
  y: number = 0;
  health: number = 0;
  color: string = "";
}

export type ItemEntityData = [
  x: number,
  y: number,
  health: number,
  color: string
];

export default class ItemEntity extends ItemEntityState {
  id: string;
  size: number = settings.item.size;
  box: Box;
  maxHealth: number = settings.item.maxHealth;

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
    return [
      fixDecimal(this.x),
      fixDecimal(this.y),
      fixDecimal(this.health),
      this.color,
    ];
  }
}
