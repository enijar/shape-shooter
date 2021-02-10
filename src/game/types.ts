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

export type Player = {
  position: THREE.Vector3;
  health: number;
  speed: number;
  name: string;
  shape: Shape;
  weapon: Weapon;
  color: string;
  firingSpeed: number;
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
