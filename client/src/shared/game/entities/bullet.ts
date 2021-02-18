export default class Bullet {
  sX: number = 0;
  sY: number = 0;
  x: number = 0;
  y: number = 0;
  r: number = 0;
  distance: number = 0;
  velocity: number = 0.006;
  maxDistance: number = 2;
  now: number = 0;
  steps: number = 1;

  update() {
    this.x += this.velocity * Math.sin(-this.r) * this.steps;
    this.y += this.velocity * Math.cos(-this.r) * this.steps;
    const a = this.sX - this.x;
    const b = this.sY - this.y;
    this.maxDistance = Math.sqrt(a * a + b * b);
  }
}
