import * as THREE from "three";
import { Box } from "../../types";
import settings from "../../settings";

export default class ItemEntity {
  id: string;
  x: number = 0;
  y: number = 0;
  rotation = 0;
  size: number = settings.item.size;
  readonly maxHealth: number = settings.item.maxHealth;
  box: Box;
  color: string;
  health: number = 0;

  constructor() {
    this.id = THREE.MathUtils.generateUUID();
    this.x = THREE.MathUtils.randInt(
      settings.arena.size * -0.5,
      settings.arena.size * 0.5
    );
    this.y = THREE.MathUtils.randInt(
      settings.arena.size * -0.5,
      settings.arena.size * 0.5
    );
    this.box = {
      width: this.size,
      height: this.size,
      x: this.x,
      y: this.y,
    };
    this.color = `hsl(${THREE.MathUtils.randInt(1, 360)}, 50%, 65%)`;
    this.health = this.maxHealth;
  }
}
