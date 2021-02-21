import io from "socket.io-client";
import {
  GameAction,
  GameActionType,
  GameContext,
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

export default class Game {
  public players: Player[] = [];
  public events: GameEvent[] = [];
  public actions: GameAction[] = [];
  public mapSize: MapSize = { w: 2, h: 2 };
  public context: GameContext;
  public socket: SocketIOClient.Socket;
  private tps: number = 1000 / 60;
  private lastTickTime: number = 0;
  private timeoutId: NodeJS.Timeout | null = null;
  private nextPlayerId = 1;
  private subscriptions: Subscription[] = [];
  private availablePlayerIndices: number[] = [];

  constructor(context: GameContext) {
    this.context = context;
    this.socket = io();
    this.players = Array(100)
      .fill({})
      .map(() => {
        return new Player(this);
      });
    this.availablePlayerIndices = this.players.map((_, i) => i);
  }

  addPlayer(
    name: string,
    shape: Shape,
    color: string,
    ai: boolean = false
  ): Player {
    const index = this.availablePlayerIndices[0];
    this.availablePlayerIndices.splice(0, 1);
    this.players[index].id = this.nextPlayerId;
    this.players[index].alive = true;
    this.players[index].ai = ai;
    this.players[index].name = name;
    this.players[index].shape = shape;
    this.players[index].color = color;
    // todo place player in random location that is not already occupied by another player
    this.players[index].x = map(
      Math.random(),
      0,
      1,
      -this.mapSize.w / 2,
      this.mapSize.w / 2
    );
    this.players[index].y = map(
      Math.random(),
      0,
      1,
      -this.mapSize.h / 2,
      this.mapSize.h / 2
    );
    if (this.players[index].ai) {
      this.actions.push({
        type: GameActionType.playerMove,
        payload: {
          playerId: this.players[index].id,
          moveX: Math.random() > 0.5 ? -1 : 1,
          moveY: Math.random() > 0.5 ? -1 : 1,
        },
      });
    }
    this.nextPlayerId++;
    this.players.push(this.players[index]);
    this.events.push({
      type: GameEventType.playerConnected,
      payload: this.players[index],
    });
    return this.players[index];
  }

  start(tps: number = 60) {
    this.tps = 1000 / tps;

    this.addPlayer("Bot 1", Shape.triangle, "#00ff00", true);
    this.addPlayer("Bot 2", Shape.triangle, "#0000ff", true);
    this.addPlayer("Bot 3", Shape.triangle, "#0000ff", true);
    this.addPlayer("Bot 4", Shape.triangle, "#0000ff", true);

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

  private updateAi() {
    for (let i = this.players.length - 1; i >= 0; i--) {
      if (!this.players[i].ai) continue;
      let { moveX, moveY, x, y, minX, minY, maxX, maxY } = this.players[i];
      if (x <= minX + 0.05) {
        moveX = 1;
      }
      if (y <= minY + 0.05) {
        moveY = -1;
      }
      if (x >= maxX - 0.05) {
        moveX = -1;
      }
      if (y >= maxY - 0.05) {
        moveY = 1;
      }
      // Look at random player
      this.actions.push({
        type: GameActionType.playerRotate,
        payload: {
          playerId: this.players[i].id,
          r: this.players[i].r + map(Math.random(), 0, 0.2, 0.01, -0.01),
        },
      });
      this.players[i].firing = Math.random() >= 0.5;
      this.actions.push({
        type: GameActionType.playerMove,
        payload: { playerId: this.players[i].id, moveX, moveY },
      });
    }
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

    for (let i = this.actions.length - 1; i >= 0; i--) {
      const index = this.players.findIndex(
        (player) => player.id === this.actions[i].payload.playerId
      );
      if (!this.players[index].alive) {
        this.availablePlayerIndices.push(index);
        continue;
      }
      switch (this.actions[i].type) {
        case GameActionType.playerRotate:
          this.players[index].r = this.actions[i].payload.r;
          this.events.push({
            type: GameEventType.playerRotate,
            payload: {
              playerId: this.players[index].id,
              r: this.players[index].r,
            },
          });
          break;
        case GameActionType.playerMove:
          this.players[index].moveX = this.actions[i].payload.moveX;
          this.players[index].moveY = this.actions[i].payload.moveY;
          this.events.push({
            type: GameEventType.playerMove,
            payload: {
              playerId: this.players[index].id,
              moveX: this.players[index].moveX,
              moveY: this.players[index].moveY,
            },
          });
          break;
        case GameActionType.playerFire:
          this.players[index].firing = this.actions[i].payload.firing;
          this.events.push({
            type: GameEventType.playerMove,
            payload: {
              playerId: this.players[index].id,
              firing: this.players[index].firing,
            },
          });
      }
      this.actions.splice(i, 1);
    }

    for (let i = this.events.length - 1; i >= 0; i--) {
      for (let j = this.subscriptions.length - 1; j >= 0; j--) {
        if (this.events[i].type === this.subscriptions[j].event) {
          this.subscriptions[j].fn(this.events[i].payload);
        }
      }
      this.events.splice(i, 1);
    }

    this.updateAi();

    this.lastTickTime = now;
    this.timeoutId = setTimeout(() => this.tick(), this.tps);
  }
}
