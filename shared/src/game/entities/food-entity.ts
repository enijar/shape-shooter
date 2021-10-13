import * as THREE from "three";
import { Box } from "../../types";
import settings from "../../settings";

export default class FoodEntity {
  id: string;
  x: number = 0;
  y: number = 0;
  rotation = 0;
  size: number = settings.food.size;
  box: Box;

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
  }
}
