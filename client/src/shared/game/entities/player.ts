import { GameEventType, Shape } from "../../types";
import { clamp } from "../utils";
import Bullet from "./bullet";
import Game from "../game";

export default class Player {
  id: number = -1;
  ai: boolean = false;
  alive: boolean = false;
  name: string = "";
  shape: Shape = Shape.triangle;
  color: string = "#ff0000";
  hp: number = 1;
  x: number = 0;
  y: number = 0;
  r: number = 0;
  bullets: Bullet[] = Array(100)
    .fill({})
    .map(() => {
      return new Bullet();
    });
  private availableBulletIndices = this.bullets.map((_, i) => i);
  moveX: -1 | 0 | 1 = 0;
  moveY: -1 | 0 | 1 = 0;
  lastFireTime: number = 0;
  fireRate: number = 150;
  firing: boolean = false;
  velocity: number = 0.003;
  minX: number = 0;
  maxX: number = 0;
  minY: number = 0;
  maxY: number = 0;
  now: number = 0;
  steps: number = 1;
  game: Game;

  constructor(game: Game) {
    this.game = game;
    this.minX = -game.mapSize.w / 2;
    this.maxX = game.mapSize.w / 2;
    this.minY = -game.mapSize.h / 2;
    this.maxY = game.mapSize.h / 2;
  }

  private static bulletHit(
    player: Player,
    bullet: Bullet,
    r: number = 0.05
  ): boolean {
    if (!player.alive) return false;
    const a = bullet.x - player.x;
    const b = bullet.y - player.y;
    const d = Math.sqrt(a * a + b * b);
    return d <= r;
  }

  update() {
    if (!this.alive) {
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        this.bullets[i].alive = false;
      }
      this.availableBulletIndices = this.availableBulletIndices.map(
        (_, i) => i
      );
      return;
    }
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
      const index = this.availableBulletIndices[0];
      this.availableBulletIndices.splice(0, 1);
      this.bullets[index].sX = this.x;
      this.bullets[index].sY = this.y;
      this.bullets[index].x = this.x;
      this.bullets[index].y = this.y;
      this.bullets[index].r = this.r;
      this.bullets[index].alive = true;
    }

    if (this.hp === 0) {
      this.alive = false;
      this.firing = false;
      this.moveX = 0;
      this.moveY = 0;

      for (let i = this.bullets.length - 1; i >= 0; i--) {
        this.bullets[i].alive = false;
      }
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (!this.bullets[i].alive) continue;
      this.bullets[i].now = this.now;
      this.bullets[i].steps = this.steps;
      this.bullets[i].update();

      for (let j = this.game.players.length - 1; j >= 0; j--) {
        if (this.game.players[j].id === this.id) continue;
        if (Player.bulletHit(this.game.players[j], this.bullets[i])) {
          this.bullets[i].alive = false;
          this.game.players[j].hp = Math.max(
            0,
            this.game.players[j].hp - this.bullets[i].damage
          );
          this.game.events.push({
            type: GameEventType.playerHp,
            payload: {
              playerId: this.game.players[j].id,
              hp: this.game.players[j].hp,
            },
          });
          break;
        }
      }

      if (this.bullets[i].distance >= this.bullets[i].maxDistance) {
        this.bullets[i].alive = false;
      }

      if (!this.bullets[i].alive) {
        this.availableBulletIndices.push(i);
      }
    }
  }
}
