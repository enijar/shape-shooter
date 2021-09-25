import * as THREE from "three";
import { settings } from "@app/shared";
import Player from "./player";
import Bullet from "./bullet";
import { intersect } from "./utils";
import { io } from "../services/app";

export type GameOptions = {
  arenaSize?: number;
  fps?: number;
};

export default class Game {
  players: Player[] = [];
  bullets: Bullet[] = [];

  readonly arenaSize: number = 900;

  private readonly fps: number = 60;
  private readonly tickInterval: number;
  private lastTickTime = 0;

  private immediate: NodeJS.Immediate;

  constructor(options: GameOptions = {}) {
    this.arenaSize = options.arenaSize ?? this.arenaSize;
    this.fps = options.fps ?? this.fps;
    this.tickInterval = 1000 / this.fps;
  }

  addPlayer(player: Player) {
    player.color = `hsl(${THREE.MathUtils.randInt(1, 360)}, 50%, 50%)`;
    this.players.push(player);
  }

  removePlayer(player: Player) {
    for (let i = 0, length = this.players.length; i < length; i++) {
      if (this.players[i].id === player.id) {
        this.players.splice(i, 1);
        break;
      }
    }
  }

  start(onTick: Function) {
    this.tick(onTick);
  }

  destroy() {
    clearImmediate(this.immediate);
  }

  private tick(onTick: Function) {
    this.immediate = setImmediate(() => this.tick(onTick));
    const now = Date.now();
    if (now - this.lastTickTime < this.tickInterval) return;
    this.lastTickTime = now;

    // Update players
    for (let p = 0, length = this.players.length; p < length; p++) {
      this.players[p].update(this);
    }

    // Update bullets
    for (let b = this.bullets.length - 1; b >= 0; b--) {
      this.bullets[b].update(this);

      let removeBullet = false;

      // @todo how does one optimise this inner player loop?
      // Damage players that get hit by bullets
      for (let p = 0, length = this.players.length; p < length; p++) {
        // Players own bullet can't hit them
        if (this.players[p].id === this.bullets[b].playerId) continue;
        // Damage player if bullet box intersects with player box
        if (intersect(this.players[p].box, this.bullets[b].box)) {
          removeBullet = true;
          this.players[p].health = THREE.MathUtils.clamp(
            this.players[p].health - this.bullets[b].damage,
            0,
            this.players[p].maxHealth
          );

          io.emit("player.damaged", this.players[p], { reliable: true });

          // Remove player when their health runs out
          if (this.players[p].health === 0) {
            // Increase exp for player who shot the bullet that killed this player
            const playerKiller = this.players.find((player) => {
              return player.id === this.bullets[b].playerId;
            });
            if (playerKiller) {
              playerKiller.exp += settings.exp.playerKill;
            }
            io.emit("player.killed", this.players[p], { reliable: true });
            this.players.splice(p, 1);
          }
          break;
        }
      }

      // Remove bullets that have reached their max distance
      if (this.bullets[b].distance === this.bullets[b].maxDistance) {
        removeBullet = true;
      }

      if (removeBullet) {
        this.bullets.splice(b, 1);
      }
    }

    onTick();
  }
}
