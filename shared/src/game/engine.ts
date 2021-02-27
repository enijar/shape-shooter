import type { Server } from "socket.io";
import type { Socket } from "socket.io-client";
import { GameEngineContext, ModifierStatus, Shape } from "../types";
import Player from "./entities/player";
import { rand } from "../utils";
import { MODE } from "../config/consts";
import Modifier from "./entities/modifier";
import Transport from "./transport";

type MapSize = {
  w: number;
  h: number;
};

type MapBounds = {
  x: { min: number; max: number };
  y: { min: number; max: number };
};

const DEFAULT_MAP_SIZE = MODE === "dev" ? 0.5 : 1.5;

export default class Engine {
  public socket: Server | Socket;
  public context: GameEngineContext;
  public modifiers: Modifier[] = [];
  public players: Player[] = [];
  public mapSize: MapSize = { w: DEFAULT_MAP_SIZE, h: DEFAULT_MAP_SIZE };
  public mapBounds: MapBounds = {
    x: { min: -this.mapSize.w / 2, max: this.mapSize.w / 2 },
    y: { min: -this.mapSize.h / 2, max: this.mapSize.h / 2 },
  };
  private tps: number = 1000 / 60;
  private lastTickTime: number = 0;
  private timeoutId: NodeJS.Timeout | null = null;
  private nextPlayerId = 1;
  private lastModifierSpawnTime: number = 0;
  private maxModifierEntities: number = 10;
  private modifierSpawnRate: number = 1500;

  constructor(
    socket: Server | Socket,
    context: GameEngineContext = GameEngineContext.server
  ) {
    this.socket = socket;
    this.context = context;
  }

  addPlayer(name: string, shape: Shape, color: string): Player {
    const player = new Player(this);
    player.id = this.nextPlayerId;
    player.name = name;
    player.shape = shape;
    player.color = color;
    // todo: place player in random location that is not already occupied by another player
    player.x = rand(this.mapBounds.x.min, this.mapBounds.x.max);
    player.y = rand(this.mapBounds.y.min, this.mapBounds.y.max);
    if (player.name === "GOD") {
      player.fireRate = 5;
    }
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
    this.modifiers = [];
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
        this.socket.emit(
          "game.player.death",
          Transport.encode(this.players[i].id)
        );
        this.players.splice(i, 1);
      }
    }

    if (
      this.modifiers.length < this.maxModifierEntities &&
      now - this.lastModifierSpawnTime >= this.modifierSpawnRate
    ) {
      this.lastModifierSpawnTime = now;
      const modifier = new Modifier();
      modifier.status = ModifierStatus.heal;
      modifier.value = Math.max(0.01, Math.random());
      modifier.x = rand(this.mapBounds.x.min, this.mapBounds.x.max);
      modifier.y = rand(this.mapBounds.y.min, this.mapBounds.y.max);
      this.modifiers.push(modifier);
      this.socket.emit(
        "game.modifiers",
        Transport.encode(this.modifiers.map((modifier) => modifier.encode()))
      );
    }

    // todo: optimise data sent over network
    const players = this.players.map((player) => player.encode());
    this.socket.emit("game.tick", Transport.encode({ players }));

    this.lastTickTime = now;
    this.timeoutId = setTimeout(() => this.tick(), this.tps);
  }
}
