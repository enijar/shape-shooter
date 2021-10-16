import { Box } from "../../types";
import settings from "../../settings";
import PlayerEntity from "./player-entity";
import { generateUUID } from "../../utils";

export default class BulletEntity {
  id: string;
  playerId: string;
  color: string;
  x = 0;
  y = 0;
  speed = settings.bullet.size;
  rotation = 0;
  distance = 0;
  size = 10;
  box: Box;
  damage: number = settings.bullet.damage;
  readonly maxDistance = 1000;
  readonly startX: number = 0;
  readonly startY: number = 0;

  constructor(player: PlayerEntity) {
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
}
