import * as THREE from "three";
import { Action, settings } from "@app/shared";
import Game from "./game";
import Bullet from "./bullet";
import { Box } from "../types";

type Actions = {
  [action: string]: boolean;
};

export default class Player {
  id: string;
  x: number = 0;
  y: number = 0;
  actions: Actions = {};
  speed = 5;
  size = settings.player.size;
  color: string;
  rotation: number = 0;
  shooting = false;
  shootingInterval = 150;
  lastShotTime = 0;
  dx: number = 0;
  dy: number = 0;
  box: Box;
  health: number = 0;
  exp: number = 0;
  readonly maxHealth: number = 100;

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

    const a = game.arenaSize * 0.5;
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
