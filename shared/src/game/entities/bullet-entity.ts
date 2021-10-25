import { Box } from "../../types";
import settings from "../../settings";
import PlayerEntity from "./player-entity";
import { fixDecimal, generateUUID } from "../../utils";

export class BulletEntityData {
  color: string = "";
  x = 0;
  y = 0;
  rotation = 0;
}

export default class BulletEntity extends BulletEntityData {
  id: string;
  playerId: string;
  speed = settings.bullet.size;
  distance = 0;
  size = 10;
  box: Box;
  damage: number = settings.bullet.damage;
  readonly maxDistance = 1000;
  readonly startX: number = 0;
  readonly startY: number = 0;

  constructor(player: PlayerEntity) {
    super();
    this.id = generateUUID();
    this.playerId = player.id;
    this.color = player.color;
    this.x = player.x;
    this.y = player.y;
    this.startX = this.x;
    this.startY = this.y;
    this.rotation = player.rotation;
    this.box = {
      width: this.size * 2,
      height: this.size * 2,
      x: this.x,
      y: this.y,
    };
  }

  getData(): BulletEntityData {
    return {
      color: this.color,
      x: fixDecimal(this.x),
      y: fixDecimal(this.y),
      rotation: fixDecimal(this.rotation),
    };
  }
}
