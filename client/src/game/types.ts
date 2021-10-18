import { PlayerEntity } from "@app/shared";

export enum Scene {
  play = "play",
}

export type ConnectedData = {
  player: PlayerEntity;
  players: PlayerEntity[];
};

export enum Subscription {
  tick = "tick",
}
