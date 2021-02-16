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
  players: Player[];
  setPlayers: (players: Player[]) => void;
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
  bullets: Bullet[];
};

export enum EngineActionType {
  connect,
  move,
  rotate,
  shoot,
}

export type ConnectedPayload = {
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
