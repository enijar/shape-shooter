import { Server } from "socket.io";
import { Shape } from "./types";
import Player from "./entities/player";
import { map } from "./utils";

type MapSize = {
  w: number;
  h: number;
};

type MapBounds = {
  x: { min: number; max: number };
  y: { min: number; max: number };
};

export default class Game {
  public socket: Server;
  public players: Player[] = [];
  public mapSize: MapSize = { w: 0.5, h: 0.5 };
  public mapBounds: MapBounds = {
    x: { min: -this.mapSize.w / 2, max: this.mapSize.w / 2 },
    y: { min: -this.mapSize.h / 2, max: this.mapSize.h / 2 },
  };
  private tps: number = 1000 / 60;
  private lastTickTime: number = 0;
  private timeoutId: NodeJS.Timeout | null = null;
  private nextPlayerId = 1;

  constructor(socket: Server) {
    this.socket = socket;
  }

  addPlayer(name: string, shape: Shape, color: string): Player {
    const player = new Player(this);
    player.id = this.nextPlayerId;
    player.name = name;
    player.shape = shape;
    player.color = color;
    // todo: place player in random location that is not already occupied by another player
    player.x = map(
      Math.random(),
      0,
      1,
      this.mapBounds.x.min,
      this.mapBounds.x.max
    );
    player.y = map(
      Math.random(),
      0,
      1,
      this.mapBounds.y.min,
      this.mapBounds.y.max
    );
    this.nextPlayerId++;
    this.players.push(player);
    return this.players[this.players.length - 1];
  }

  removePlayer(id: number) {
    for (let i = this.players.length - 1; i >= 0; i--) {
      if (this.players[i].id === id) {
        this.players.splice(i, 1);
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
      if (this.players[i].hp === 0) {
        this.socket.emit("game.player.death", this.players[i].id);
        this.players.splice(i, 1);
      }
    }

    // todo: optimise data sent over network
    this.socket.emit("game.tick", {
      players: this.players.map((player) => player.encode()),
    });

    this.lastTickTime = now;
    this.timeoutId = setTimeout(() => this.tick(), this.tps);
  }
}
