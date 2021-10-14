import * as THREE from "three";
import { Action, PlayerEntity, settings } from "@app/shared";
import Game from "../game";
import Bullet from "./bullet";

export default class Player extends PlayerEntity {
  constructor(id: string) {
    super(id);
    this.fresh();
  }

  fresh() {
    this.x = 0;
    this.y = 0;
    this.box = {
      width: this.size,
      height: this.size,
      x: this.x,
      y: this.y,
    };
    this.health = this.maxHealth;
    this.exp = 0;
    this.dx = 0;
    this.dy = 0;
    this.rotation = 0;
  }

  update(game: Game) {
    if (this.shooting) {
      const now = Date.now();
      if (now - this.lastShotTime >= this.shootingInterval) {
        this.lastShotTime = now;
        game.bullets.push(new Bullet(this));
      }
    }

    this.dx = 0;
    this.dy = 0;
    for (const action in this.actions) {
      if (!this.actions[action]) continue;
      if (action === Action.up) {
        this.dy = 1;
      }
      if (action === Action.down) {
        this.dy = -1;
      }
      if (action === Action.left) {
        this.dx = -1;
      }
      if (action === Action.right) {
        this.dx = 1;
      }
    }

    const a = settings.arena.size * 0.5;
    const p = this.speed * 0.5;
    this.x = THREE.MathUtils.clamp(
      this.x + this.speed * this.dx,
      -a + p,
      a - p
    );
    this.y = THREE.MathUtils.clamp(
      this.y + this.speed * this.dy,
      -a + p,
      a - p
    );
    this.box.x = this.x;
    this.box.y = this.y;
  }
}
