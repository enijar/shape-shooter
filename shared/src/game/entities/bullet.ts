import { BulletType } from "../../types";

export default class Bullet {
  sX: number = 0;
  sY: number = 0;
  x: number = 0;
  y: number = 0;
  r: number = 0;
  damage: number = 0.05;
  distance: number = 0;
  velocity: number = 0.006;
  maxDistance: number = 1.25;
  now: number = 0;
  steps: number = 1;
  type: BulletType = BulletType.circle;

  encode(): object {
    return {
      x: this.x,
      y: this.y,
      type: this.type,
    };
  }

  update() {
    this.x += this.velocity * Math.sin(-this.r) * this.steps;
    this.y += this.velocity * Math.cos(-this.r) * this.steps;
    const a = this.sX - this.x;
    const b = this.sY - this.y;
    this.distance = Math.sqrt(a * a + b * b);
  }
}
