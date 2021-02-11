import type * as THREE from "three";

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
  position: THREE.Vector3;
  rotation: THREE.Euler;
};

export type Player = {
  position: THREE.Vector3;
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
  player: Player;
  setPlayer: Function;
  movePlayer: Function;
  shoot: Function;
};

export enum Controls {
  moveUp = "w",
  moveDown = "s",
  moveLeft = "a",
  moveRight = "d",
}
