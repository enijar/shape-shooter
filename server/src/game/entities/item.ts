import Game from "../game";
import { settings } from "@app/shared";
import * as THREE from "three";
import { Box } from "../types";

export default class Item {
  id: string;
  x: number = 0;
  y: number = 0;
  rotation = 0;
  size: number = settings.item.size;
  readonly maxHealth: number = settings.item.maxHealth;
  box: Box;
  color: string;
  health: number = 0;

  constructor(game: Game) {
    this.id = THREE.MathUtils.generateUUID();
    this.x = THREE.MathUtils.randInt(
      game.arenaSize * -0.5,
      game.arenaSize * 0.5
    );
    this.y = THREE.MathUtils.randInt(
      game.arenaSize * -0.5,
      game.arenaSize * 0.5
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

  update(game: Game) {
    //
  }
}
