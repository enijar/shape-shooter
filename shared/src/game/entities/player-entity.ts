import { Box } from "../../types";
import settings from "../../settings";
import { fixDecimal } from "../../utils";

type Actions = {
  [action: string]: boolean;
};

export class PlayerEntityState {
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

export type PlayerEntityData = [
  id: string,
  x: number,
  y: number,
  color: string,
  rotation: number,
  exp: number,
  health: number,
  maxHealth: number,
  name: string
];

export default class PlayerEntity extends PlayerEntityState {
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
    return [
      this.id,
      fixDecimal(this.x),
      fixDecimal(this.y),
      this.color,
      fixDecimal(this.rotation),
      this.exp,
      fixDecimal(this.health),
      this.maxHealth,
      this.name,
    ];
  }
}
