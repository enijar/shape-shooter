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

export enum ControlsKeys {
  moveUp = "w",
  moveDown = "s",
  moveLeft = "a",
  moveRight = "d",
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
