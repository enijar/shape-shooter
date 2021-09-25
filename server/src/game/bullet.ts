import * as THREE from "three";
import Player from "./player";
import Game from "./game";
import { distance } from "./utils";
import { Box } from "../types";

export default class Bullet {
  id: string;
  playerId: string;
  color: string;
  x = 0;
  y = 0;
  speed = 10;
  rotation = 0;
  distance = 0;
  size = 10;
  box: Box;
  damage: number = 5;
  readonly maxDistance = 800;
  private readonly startX: number = 0;
  private readonly startY: number = 0;

  constructor(player: Player) {
    this.id = THREE.MathUtils.generateUUID();
    this.playerId = player.id;
    this.color = player.color;
    this.x = player.x;
    this.y = player.y;
    this.startX = this.x;
    this.startY = this.y;
    this.rotation = player.rotation;
    this.box = {
      width: this.size,
      height: this.size,
      x: this.x,
      y: this.y,
    };
  }

  update(game: Game) {
    this.x += this.speed * Math.sin(-this.rotation);
    this.y += this.speed * Math.cos(-this.rotation);
    this.distance = THREE.MathUtils.clamp(
      distance(this.startX, this.startY, this.x, this.y),
      0,
      this.maxDistance
    );
    this.box.x = this.x;
    this.box.y = this.y;
  }
}
