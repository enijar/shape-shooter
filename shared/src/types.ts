export enum Shape {
  circle = "circle",
  square = "square",
  triangle = "triangle",
}

export enum Weapon {
  uzi = "uzi",
  sniper = "sniper",
  shotgun = "shotgun",
  handgun = "handgun",
}

export type BulletData = {
  x: number;
  y: number;
  type: BulletType;
};

export type PlayerData = {
  id: number;
  name: string;
  shape: Shape;
  type: PlayerType;
  color: string;
  hp: number;
  x: number;
  y: number;
  r: number;
  bullets: BulletData[];
};

export enum ModifierStatus {
  empty,
  heal,
}

export type ModifierData = {
  x: number;
  y: number;
  status: ModifierStatus;
};

export enum GameEngineContext {
  client,
  server,
}

export enum BulletType {
  circle,
  square,
  triangle,
  ring,
}

export enum PlayerType {
  human,
  bot,
}
