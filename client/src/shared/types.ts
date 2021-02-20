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

export type NewPlayer = {
  name: string;
  shape: Shape;
  weapon: Weapon;
  color: string;
};

export enum Controls {
  moveUp = "w",
  moveDown = "s",
  moveLeft = "a",
  moveRight = "d",
}

export type Bullet = {
  id: number;
  playerId: number;
  sX: number;
  sY: number;
  x: number;
  y: number;
  r: number;
};

export type Player = {
  id: number;
  name: string;
  x: number;
  y: number;
  r: number;
  shape: Shape;
  color: string;
};

export type ShotPayload = {
  playerId: number;
  bullets: Bullet[];
};

export type State = {
  players: Player[];
  bullets: Bullet[];
};

export enum GameActionType {
  playerRotate,
}

export type GameAction = {
  type: GameActionType;
  payload: any;
};

export enum GameEventType {
  playerConnected,
  playerDisconnected,
  playerHp,
  playerFire,
  playerRotate,
  playerMove,
}

export type GameEvent = {
  type: GameEventType;
  payload: any;
};
