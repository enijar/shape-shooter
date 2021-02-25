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

export enum ControlsKeys {
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
  playerMove,
  playerFire,
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

export enum GameContext {
  client,
  server,
}

export type BulletData = {
  x: number;
  y: number;
};

export type PlayerData = {
  id: number;
  name: string;
  shape: Shape;
  color: string;
  hp: number;
  x: number;
  y: number;
  r: number;
  bullets: BulletData[];
};
