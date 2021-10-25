import { Box } from "../../types";
import settings from "../../settings";
import { fixDecimal, generateUUID } from "../../utils";

export class AiMissileEntityState {
  x: number = 0;
  y: number = 0;
  rotation: number = 0;
  health: number = 0;
}

export type AiMissileEntityData = [
  x: number,
  y: number,
  rotation: number,
  health: number
];

export default class AiMissileEntity extends AiMissileEntityState {
  id: string;
  speed = 4;
  size = settings.ai.missile.size;
  damage: number = settings.ai.missile.damage;
  dx: number = 0;
  dy: number = 0;
  box: Box = {
    width: settings.ai.missile.size,
    height: settings.ai.missile.size,
    x: 0,
    y: 0,
  };
  maxHealth: number = settings.ai.missile.maxHealth;

  constructor() {
    super();
    this.id = generateUUID();
    this.health = this.maxHealth;
  }

  getData(): AiMissileEntityData {
    return [
      fixDecimal(this.x),
      fixDecimal(this.y),
      fixDecimal(this.rotation),
      fixDecimal(this.health),
    ];
  }
}
