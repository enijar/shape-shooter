import { GameEventType, Shape } from "../types";
import { clamp } from "../utils";
import Bullet from "./bullet";
import Game from "../game";

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
  fireRate: number = 150;
  firing: boolean = false;
  velocity: number = 0.003;
  now: number = 0;
  steps: number = 1;
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  private static bulletHit(
    player: Player,
    bullet: Bullet,
    r: number = 0.05
  ): boolean {
    const a = bullet.x - player.x;
    const b = bullet.y - player.y;
    const d = Math.sqrt(a * a + b * b);
    return d <= r;
  }

  encode(): object {
    return {
      id: this.id,
      name: this.name,
      shape: this.shape,
      color: this.color,
      hp: this.hp,
      x: this.x,
      y: this.y,
      r: this.r,
      bullets: this.bullets.map((bullet) => bullet.encode()),
    };
  }

  update() {
    let velocity = this.velocity;
    if (this.moveX !== 0 && this.moveY !== 0) {
      // Move slower if moving diagonally
      velocity *= 0.75;
    }
    this.x += velocity * this.moveX * this.steps;
    this.y -= velocity * this.moveY * this.steps;
    this.x = clamp(
      this.x,
      this.game.mapBounds.x.min,
      this.game.mapBounds.x.max
    );
    this.y = clamp(
      this.y,
      this.game.mapBounds.y.min,
      this.game.mapBounds.y.max
    );

    if (this.firing && this.now - this.lastFireTime >= this.fireRate) {
      this.lastFireTime = this.now;
      const bullet = new Bullet();
      bullet.sX = this.x;
      bullet.sY = this.y;
      bullet.x = this.x;
      bullet.y = this.y;
      bullet.r = this.r;
      this.bullets.push(bullet);
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].now = this.now;
      this.bullets[i].steps = this.steps;
      this.bullets[i].update();

      let remove = false;
      for (let j = this.game.players.length - 1; j >= 0; j--) {
        if (this.game.players[j].id === this.id) continue;
        if (Player.bulletHit(this.game.players[j], this.bullets[i])) {
          remove = true;
          this.game.players[j].hp = Math.max(
            0,
            this.game.players[j].hp - this.bullets[i].damage
          );
          break;
        }
      }

      if (this.bullets[i].distance >= this.bullets[i].maxDistance) {
        remove = true;
      }

      if (remove) {
        this.bullets.splice(i, 1);
      }
    }
  }
}
