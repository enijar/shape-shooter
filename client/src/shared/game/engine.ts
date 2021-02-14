import { Bullet, Move, Player, Shape, Weapon } from "../types";
import { guid } from "../../game/utils";

type GameEngineState = {
  player: null | Player;
  players: Player[];
  bullets: Bullet[];
};

export enum GameEngineContext {
  server = "server",
  client = "client",
}

let nextFrame: number = -1;
let nextBulletIndex = 0;

const state: GameEngineState = {
  player: {
    id: guid(),
    x: 0,
    y: 0,
    r: 0,
    health: 0.8,
    speed: 0.005,
    name: "Enijar",
    shape: Shape.triangle,
    weapon: Weapon.handgun,
    color: "#ff0000",
    lastShotTime: 0,
    shootingSpeed: 0.75,
  },
  players: [
    {
      id: guid(),
      x: 0.15,
      y: 0.3,
      r: 0,
      health: 1,
      speed: 0.005,
      name: "Player 2",
      shape: Shape.triangle,
      weapon: Weapon.handgun,
      color: "#00ff00",
      lastShotTime: 0,
      shootingSpeed: 0.75,
    },
  ],
  bullets: Array(100)
    .fill({})
    .map(() => {
      return {
        id: guid(),
        ownerId: "",
        active: false,
        lifetime: 3500,
        speed: 0.01,
        createdAt: 0,
        x: 0,
        y: 0,
        r: 0,
      };
    }),
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  state,
  context: GameEngineContext.client,
  destroy() {
    cancelAnimationFrame(nextFrame);
  },
  playerMove(move: Move): null | Player {
    if (this.state.player === null) return null;
    if (move.x.move) {
      this.state.player.x -= move.x.amount * this.state.player.speed;
    }
    if (move.y.move) {
      this.state.player.y -= move.y.amount * this.state.player.speed;
    }
    return this.state.player;
  },
  playerShoot(): Bullet[] {
    if (this.state.player === null) return this.state.bullets;
    this.state.bullets[nextBulletIndex].ownerId = this.state.player.id;
    this.state.bullets[nextBulletIndex].active = true;
    this.state.bullets[nextBulletIndex].createdAt = Date.now();
    this.state.bullets[nextBulletIndex].x = this.state.player.x;
    this.state.bullets[nextBulletIndex].y = this.state.player.y;
    this.state.bullets[nextBulletIndex].r = this.state.player.r;
    nextBulletIndex++;
    if (nextBulletIndex === this.state.bullets.length) {
      nextBulletIndex = 0;
    }
    return this.state.bullets;
  },
  update() {
    const now = Date.now();
    for (let i = this.state.bullets.length - 1; i >= 0; i--) {
      if (!this.state.bullets[i].active) continue;
      // Remove old bullets
      if (
        now - this.state.bullets[i].createdAt >=
        this.state.bullets[i].lifetime
      ) {
        this.state.bullets[i].active = false;
        continue;
      }
      // Update bullet position using rotation(z) as the angle of direction:
      // angle = rotation(z)
      // x = x + speed * sin(-angle);
      // y = y + speed * cos(-angle);
      this.state.bullets[i].x +=
        this.state.bullets[i].speed * Math.sin(-this.state.bullets[i].r);
      this.state.bullets[i].y +=
        this.state.bullets[i].speed * Math.cos(-this.state.bullets[i].r);
    }

    return this.state;
  },
};
