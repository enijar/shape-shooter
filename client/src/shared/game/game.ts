import {
  GameAction,
  GameActionType,
  GameEvent,
  GameEventType,
  Shape,
} from "../types";
import Player from "./entities/player";
import { map } from "./utils";

type Subscription = {
  event: GameEventType;
  fn: (payload: any) => void;
};

type MapSize = {
  w: number;
  h: number;
};

export class Game {
  public players: Player[] = [];
  public events: GameEvent[] = [];
  public actions: GameAction[] = [];
  public mapSize: MapSize = { w: 0.5, h: 0.5 };
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
    // todo place player in random location that is not already occupied by another player
    player.x = map(
      Math.random(),
      0,
      1,
      -this.mapSize.w / 2,
      this.mapSize.w / 2
    );
    player.y = map(
      Math.random(),
      0,
      1,
      -this.mapSize.h / 2,
      this.mapSize.h / 2
    );
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
    const index = this.subscriptions.length - 1;
    return () => {
      this.subscriptions.splice(index, 1);
    };
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
      const index = this.players.findIndex(
        (player) => player.id === this.actions[i].payload.playerId
      );
      switch (this.actions[i].type) {
        case GameActionType.playerRotate:
          this.players[index].r = this.actions[i].payload.r;
          break;
        case GameActionType.playerMove:
          this.players[index].moveX = this.actions[i].payload.moveX;
          this.players[index].moveY = this.actions[i].payload.moveY;
          break;
        case GameActionType.playerFire:
          this.players[index].firing = this.actions[i].payload.firing;
      }
      this.actions.splice(i, 1);
    }

    this.lastTickTime = now;
    this.timeoutId = setTimeout(() => this.tick(), this.tps);
  }
}

export default new Game();
