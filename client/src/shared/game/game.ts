import { Shape } from "../types";
import state from "./state";
import Player from "./entities/player";

class Game {
  players: Player[] = [];
  private tps: number = 1000 / 60;
  private lastTickTime: number = 0;
  private timeoutId: NodeJS.Timeout | null = null;
  private nextPlayerId = 1;

  addPlayer(name: string, shape: Shape, color: string): Player {
    const player = new Player();
    player.id = this.nextPlayerId;
    player.name = name;
    player.shape = shape;
    player.color = color;
    this.nextPlayerId++;
    this.players.push(player);
    return player;
  }

  removePlayer(id: number) {
    for (let i = this.players.length - 1; i >= 0; i--) {
      if (this.players[i].id === id) {
        this.players.splice(i, 1);
        break;
      }
    }
  }

  rotatePlayer(id: number, r: number) {
    for (let i = this.players.length - 1; i >= 0; i--) {
      if (this.players[i].id === id) {
        this.players[i].r = r;
        break;
      }
    }
  }

  movePlayer(id: number, moveX: -1 | 0 | 1, moveY: -1 | 0 | 1) {
    for (let i = this.players.length - 1; i >= 0; i--) {
      if (this.players[i].id === id) {
        this.players[i].moveX = moveX;
        this.players[i].moveY = moveY;
        break;
      }
    }
  }

  start(tps: number = 60) {
    this.tps = 1000 / tps;
    this.tick();
  }

  stop() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.players = [];
    this.nextPlayerId = 1;
  }

  private tick() {
    const now = Date.now();
    const delta = Math.max(1, now - this.lastTickTime);
    const steps = delta / this.tps;

    for (let i = this.players.length - 1; i >= 0; i--) {
      this.players[i].now = now;
      this.players[i].steps = steps;
      this.players[i].update();
    }

    state.totalPlayers = this.players.length;
    state.players = this.players;

    this.lastTickTime = now;
    this.timeoutId = setTimeout(() => this.tick(), this.tps);
  }
}

export default new Game();
