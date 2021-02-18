import { Shape } from "../../types";
import { clamp } from "../utils";
import Bullet from "./bullet";
import state from "../state";

export default class Player {
  id: number = -1;
  name: string = "";
  shape: Shape = Shape.triangle;
  color: string = "#ff0000";
  hp: number = 1;
  x: number = 0;
  y: number = 0;
  r: number = 0;
  bullets: Bullet[] = [];
  moveX: -1 | 0 | 1 = 0;
  moveY: -1 | 0 | 1 = 0;
  lastFireTime: number = 0;
  fireRate: number = 250;
  firing: boolean = false;
  velocity: number = 0.003;
  minX: number = -1;
  maxX: number = 1;
  minY: number = -1;
  maxY: number = 1;
  now: number = 0;
  steps: number = 1;

  rotate(r: number) {
    this.r = r;
  }

  move(moveX: -1 | 0 | 1 = 0, moveY: -1 | 0 | 1 = 0) {
    this.moveX = moveX;
    this.moveY = moveY;
  }

  update() {
    let velocity = this.velocity;
    if (this.moveX !== 0 && this.moveY !== 0) {
      // Move slower if moving diagonally
      velocity *= 0.75;
    }
    this.x += velocity * this.moveX * this.steps;
    this.y -= velocity * this.moveY * this.steps;
    this.x = clamp(this.x, this.minX, this.maxX);
    this.y = clamp(this.y, this.minY, this.maxY);

    if (this.firing && this.now - this.lastFireTime >= this.fireRate) {
      this.lastFireTime = this.now;
      const bullet = new Bullet();
      bullet.sX = this.x;
      bullet.sY = this.y;
      bullet.x = this.x;
      bullet.y = this.y;
      bullet.r = this.r;
      this.bullets.push(bullet);
      state.totalBullets++;
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].now = this.now;
      this.bullets[i].steps = this.steps;
      this.bullets[i].update();

      if (this.bullets[i].distance >= this.bullets[i].maxDistance) {
        this.bullets.splice(i, 1);
        state.totalBullets--;
      }
    }
  }
}
