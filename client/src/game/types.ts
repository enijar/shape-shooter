import { PlayerEntityData } from "@app/shared";

export enum Scene {
  play = "play",
}

export type ConnectedData = {
  player: PlayerEntityData;
  players: PlayerEntityData[];
};

export enum Subscription {
  tick = "tick",
}
