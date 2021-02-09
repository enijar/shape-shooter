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

export type Player = {
  x: number;
  y: number;
  health: number;
  speed: number;
  name: string;
  shape: Shape;
  weapon: Weapon;
};

export type GameState = {
  player: Player;
  setPlayer: Function;
  movePlayer: Function;
};

export enum Controls {
  moveUp = "w",
  moveDown = "s",
  moveLeft = "a",
  moveRight = "d",
}
