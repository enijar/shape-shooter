import { Box } from "../../types";
import settings from "../../settings";
import { generateUUID } from "../../utils";

export default class AiMissileEntity {
  id: string;
  x: number = 0;
  y: number = 0;
  speed = 4;
  size = settings.ai.missile.size;
  color: string = "";
  rotation: number = 0;
  damage: number = settings.ai.missile.damage;
  dx: number = 0;
  dy: number = 0;
  box: Box = {
    width: settings.ai.missile.size,
    height: settings.ai.missile.size,
    x: 0,
    y: 0,
  };
  health: number = 0;
  readonly maxHealth: number = settings.ai.missile.maxHealth;

  constructor() {
    this.id = generateUUID();
  }
}
