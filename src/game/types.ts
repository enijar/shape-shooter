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

export type Bullet = {
  lifetime: number;
  speed: number;
  createdAt: number;
  position: number[];
  rotation: number[];
};

export type Player = {
  id: string;
  position: number[];
  rotation: number[];
  health: number;
  speed: number;
  name: string;
  shape: Shape;
  weapon: Weapon;
  color: string;
  shootingSpeed: number;
  bullets: Bullet[];
};

export type GameState = {
  players: Player[];
  setPlayers: Function;
  movePlayer: Function;
  shoot: Function;
  update: Function;
  size: number;
  setSize: Function;
  zoom: number;
  setZoom: Function;
  currentPlayerId: string;
  setCurrentPlayerId: Function;
};

export enum Controls {
  moveUp = "w",
  moveDown = "s",
  moveLeft = "a",
  moveRight = "d",
}
