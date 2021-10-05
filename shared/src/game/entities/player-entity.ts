import { Box } from "../../types";
import settings from "../../settings";

type Actions = {
  [action: string]: boolean;
};

export default class PlayerEntity {
  id: string;
  x: number = 0;
  y: number = 0;
  actions: Actions = {};
  speed = 5;
  size = settings.player.size;
  color: string = "";
  rotation: number = 0;
  shooting = false;
  shootingInterval = 150;
  lastShotTime = 0;
  dx: number = 0;
  dy: number = 0;
  box: Box;
  health: number = 0;
  exp: number = 0;
  inGame: boolean = false;
  name: string = "Noob";
  readonly maxHealth: number = settings.player.maxHealth;

  constructor(id: string) {
    this.id = id;
    this.box = {
      width: this.size,
      height: this.size,
      x: this.x,
      y: this.y,
    };
    this.health = this.maxHealth;
  }
}
