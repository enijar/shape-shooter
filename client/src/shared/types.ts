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
  id: string;
  ownerId: string;
  active: boolean;
  lifetime: number;
  speed: number;
  createdAt: number;
  x: number;
  y: number;
  r: number;
};

export type Player = {
  id: number;
  active: boolean;
  x: number;
  y: number;
  r: number;
  health: number;
  speed: number;
  name: string;
  shape: Shape;
  weapon: Weapon;
  color: string;
  lastShotTime: number;
  shootingSpeed: number;
};

export type GameState = {
  player: null | Player;
  setPlayer: Function;
  players: Player[];
  setPlayers: Function;
  size: number;
  setSize: Function;
  zoom: number;
  setZoom: Function;
};

export enum Controls {
  moveUp = "w",
  moveDown = "s",
  moveLeft = "a",
  moveRight = "d",
}

export type Move = {
  x: {
    move: boolean;
    amount: number;
  };
  y: {
    move: boolean;
    amount: number;
  };
};
