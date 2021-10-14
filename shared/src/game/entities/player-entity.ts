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
  box: Box = {
    width: settings.player.size,
    height: settings.player.size,
    x: 0,
    y: 0,
  };
  health: number = 0;
  exp: number = 0;
  name: string = "Noob";
  readonly maxHealth: number = settings.player.maxHealth;

  constructor(id: string) {
    this.id = id;
  }
}
