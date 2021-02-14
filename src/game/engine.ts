import { Bullet, Player, Shape, Weapon } from "./types";
import { guid } from "./utils";

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
    position: [0, 0, 0],
    rotation: [0, 0, 0],
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
      position: [0.15, 0.3, 0],
      rotation: [0, 0, 0],
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
  bullets: Array(100).fill(null),
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  state,
  context: GameEngineContext.client,
  destroy() {
    cancelAnimationFrame(nextFrame);
  },
  playerMove(axes: string[], direction: number): null | Player {
    if (this.state.player === null) return null;
    const { speed } = this.state.player;
    let [x, y, z] = this.state.player.position;
    if (axes.includes("x")) {
      x -= direction * speed;
    }
    if (axes.includes("y")) {
      y -= direction * speed;
    }
    this.state.player.position = [x, y, z];
    return this.state.player;
  },
  playerShoot(): Bullet[] {
    if (this.state.player === null) return this.state.bullets;
    const { position, rotation } = this.state.player;
    this.state.bullets[nextBulletIndex] = {
      id: guid(),
      ownerId: this.state.player.id,
      lifetime: 3500,
      speed: 0.01,
      createdAt: Date.now(),
      position: [...position],
      rotation: [...rotation],
    };
    nextBulletIndex++;
    if (nextBulletIndex === this.state.bullets.length) {
      nextBulletIndex = 0;
    }
    return this.state.bullets;
  },
  update() {
    const now = Date.now();
    for (let i = this.state.bullets.length - 1; i >= 0; i--) {
      if (this.state.bullets[i] === null) continue;
      // Remove old bullets
      if (
        now - this.state.bullets[i].createdAt >=
        this.state.bullets[i].lifetime
      ) {
        this.state.bullets.splice(i, 1);
        continue;
      }
      // Update bullet position
      const [x, y, z] = this.state.bullets[i].position;
      this.state.bullets[i].position = [x, y + this.state.bullets[i].speed, z];
    }

    return this.state;
  },
};
