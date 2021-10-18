import { Box } from "../../types";
import settings from "../../settings";
import { fixDecimal } from "../../utils";

type Actions = {
  [action: string]: boolean;
};

export class PlayerEntityData {
  id: string = "";
  x: number = 0;
  y: number = 0;
  color: string = "";
  rotation: number = 0;
  exp: number = 0;
  health: number = 0;
  maxHealth: number = settings.player.maxHealth;
  name: string = "Noob";
}

export default class PlayerEntity extends PlayerEntityData {
  actions: Actions = {};
  speed = 5;
  size = settings.player.size;
  shooting = false;
  shootingInterval = 150;
  lastShotTime = 0;
  dx: number = 0;
  dy: number = 0;
  box: Box = {
    width: settings.player.size,
    height: settings.player.size,
    x: 0,
    y: 0,
  };

  constructor(id: string) {
    super();
    this.id = id;
  }

  getData(): PlayerEntityData {
    return {
      id: this.id,
      x: fixDecimal(this.x),
      y: fixDecimal(this.y),
      color: this.color,
      rotation: fixDecimal(this.rotation),
      exp: this.exp,
      health: fixDecimal(this.health),
      maxHealth: this.maxHealth,
      name: this.name,
    };
  }
}
