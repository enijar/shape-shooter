import * as THREE from "three";
import { BulletEntity } from "@app/shared";
import Player from "./player";
import Game from "../game";
import { distance } from "../utils";

export default class Bullet extends BulletEntity {
  constructor(player: Player) {
    super(player);
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
