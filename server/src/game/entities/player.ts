import { ModifierStatus, Shape } from "../../../../client/src/shared/types";
import { clamp, collision } from "../utils";
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

    let modifierCollision = false;
    for (let i = this.game.modifiers.length - 1; i >= 0; i--) {
      const { x: x1, y: y1 } = this;
      const { x: x2, y: y2 } = this.game.modifiers[i];
      if (collision(x1, y1, x2, y2)) {
        switch (this.game.modifiers[i].status) {
          case ModifierStatus.heal:
            this.hp = Math.min(1, this.hp + this.game.modifiers[i].value);
            break;
        }
        modifierCollision = true;
        this.game.modifiers.splice(i, 1);
      }
    }

    if (modifierCollision) {
      this.game.socket.emit(
        "game.modifiers",
        this.game.modifiers.map((modifier) => modifier.encode())
      );
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].now = this.now;
      this.bullets[i].steps = this.steps;
      this.bullets[i].update();

      let remove = false;
      for (let j = this.game.players.length - 1; j >= 0; j--) {
        if (this.game.players[j].id === this.id) continue;
        const { x: x1, y: y1 } = this.game.players[j];
        const { x: x2, y: y2 } = this.bullets[i];
        if (collision(x1, y1, x2, y2)) {
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
