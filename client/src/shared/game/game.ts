import { GameActionType, Shape } from "../types";
import { GameEvent, GameAction, GameEventType } from "../types";
import Player from "./entities/player";

type Subscription = {
  event: GameEventType;
  fn: (payload: any) => void;
};

export class Game {
  public players: Player[] = [];
  public events: GameEvent[] = [];
  public actions: GameAction[] = [];
  private tps: number = 1000 / 60;
  private lastTickTime: number = 0;
  private timeoutId: NodeJS.Timeout | null = null;
  private nextPlayerId = 1;
  private subscriptions: Subscription[] = [];

  addPlayer(name: string, shape: Shape, color: string): Player {
    const player = new Player(this);
    player.id = this.nextPlayerId;
    player.name = name;
    player.shape = shape;
    player.color = color;
    this.nextPlayerId++;
    this.players.push(player);
    this.events.push({
      type: GameEventType.playerConnected,
      payload: player,
    });
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
    this.subscriptions = [];
  }

  subscribe(event: GameEventType, fn: (payload: any) => void) {
    this.subscriptions.push({ event, fn });
  }

  action(action: GameActionType, payload: any) {
    this.actions.push({ type: action, payload });
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

    for (let i = this.events.length - 1; i >= 0; i--) {
      for (let j = this.subscriptions.length - 1; j >= 0; j--) {
        if (this.events[i].type === this.subscriptions[j].event) {
          this.subscriptions[j].fn(this.events[i].payload);
        }
      }
      this.events.splice(i, 1);
    }

    for (let i = this.actions.length - 1; i >= 0; i--) {
      switch (this.actions[i].type) {
        case GameActionType.playerRotate:
          const index = this.players.findIndex(
            (player) => player.id === this.actions[i].payload.playerId
          );
          this.players[index].r = this.actions[i].payload.r;
          break;
      }
      this.actions.splice(i, 1);
    }

    this.lastTickTime = now;
    this.timeoutId = setTimeout(() => this.tick(), this.tps);
  }
}

export default new Game();
