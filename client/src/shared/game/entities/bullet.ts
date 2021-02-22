export default class Bullet {
  sX: number = 0;
  sY: number = 0;
  x: number = 0;
  y: number = 0;
  r: number = 0;
  damage: number = 0.05;
  alive: boolean = false;
  distance: number = 0;
  velocity: number = 0.006;
  maxDistance: number = 0.75;
  now: number = 0;
  steps: number = 1;

  update() {
    if (!this.alive) return;
    this.x += this.velocity * Math.sin(-this.r) * this.steps;
    this.y += this.velocity * Math.cos(-this.r) * this.steps;
    const a = this.sX - this.x;
    const b = this.sY - this.y;
    this.distance = Math.sqrt(a * a + b * b);
  }
}
