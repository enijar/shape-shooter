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

export type GameState = {
  playerId: number;
  setPlayerId: (playerId: number) => void;
  playerIds: number[];
  setPlayerIds: (playerIds: number[]) => void;
  size: number;
  setSize: (size: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
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
  createdAt: number;
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

export enum EngineActionType {
  idle,
  connect,
  disconnect,
  move,
  rotate,
  shoot,
}

export type ConnectedPayload = {
  playerId: number;
  players: Player[];
};

export type DisconnectedPayload = {
  playerId: number;
  players: Player[];
};

export type RotatedPayload = {
  playerId: number;
  r: number;
};

export type MovedPayload = {
  playerId: number;
  x: number;
  y: number;
};

export type ShotPayload = {
  playerId: number;
  bullets: Bullet[];
};

export type State = {
  players: Player[];
  bullets: Bullet[];
};
