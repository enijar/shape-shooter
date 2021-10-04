import * as THREE from "three";
import { settings } from "@app/shared";
import { io } from "../services/app";
import { intersect } from "./utils";
import Player from "./entities/player";
import Bullet from "./entities/bullet";
import Item from "./entities/item";

export type GameOptions = {
  arenaSize?: number;
  fps?: number;
};

export default class Game {
  players: Player[] = [];
  bullets: Bullet[] = [];
  items: Item[] = [];

  readonly arenaSize: number = settings.arena.size;

  private readonly fps: number = 60;
  private readonly tickInterval: number;
  private lastTickTime = 0;

  private immediate: NodeJS.Immediate;

  private maxItems: number = 0;

  constructor(options: GameOptions = {}) {
    this.arenaSize = options.arenaSize ?? this.arenaSize;
    this.fps = options.fps ?? this.fps;
    this.tickInterval = 1000 / this.fps;
  }

  addPlayer(player: Player) {
    player.color = `hsl(${THREE.MathUtils.randInt(1, 360)}, 50%, 50%)`;
    this.players.push(player);
    this.maxItems = Math.round(Math.sqrt(this.arenaSize * this.players.length));
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

    // Add new items
    for (let i = 0; i < this.maxItems - this.items.length; i++) {
      this.items.push(new Item(this));
    }

    // Update players
    for (let p = 0, length = this.players.length; p < length; p++) {
      this.players[p].update(this);
    }

    // Update items
    for (let i = 0, length = this.items.length; i < length; i++) {
      this.items[i].update(this);
    }

    // Update bullets
    for (let b = this.bullets.length - 1; b >= 0; b--) {
      this.bullets[b].update(this);

      let removeBullet = false;

      // @todo how does one optimise this inner player loop?
      // Damage players that get hit by bullets
      for (let p = 0, length = this.players.length; p < length; p++) {
        // Ignore players that are not in the game
        if (!this.players[p].inGame) continue;

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

      // Damage items that get hit by bullets
      for (let i = 0, length = this.items.length; i < length; i++) {
        // Damage item if bullet box intersects with item box
        if (intersect(this.items[i].box, this.bullets[b].box)) {
          removeBullet = true;
          this.items[i].health = THREE.MathUtils.clamp(
            this.items[i].health - this.bullets[b].damage,
            0,
            this.items[i].maxHealth
          );

          // Remove item when its health runs out
          if (this.items[i].health === 0) {
            // Increase exp for player who shot the bullet that killed this item
            const playerKiller = this.players.find((player) => {
              return player.id === this.bullets[b].playerId;
            });
            if (playerKiller) {
              playerKiller.exp += settings.exp.itemKill;
            }
            this.items.splice(i, 1);
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

  getState() {
    return { players: this.players, bullets: this.bullets, items: this.items };
  }
}
