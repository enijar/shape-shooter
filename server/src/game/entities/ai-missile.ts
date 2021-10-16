import * as THREE from "three";
import { AiMissileEntity, dist, PlayerEntity, settings } from "@app/shared";
import Game from "../game";
import { MathUtils } from "three";

export default class AiMissile extends AiMissileEntity {
  private lerp = 0.05;
  private range = 200;
  private targetPlayer: PlayerEntity = null;
  private patrolArea = { x: 0, y: 0 };

  constructor(game: Game) {
    super();
    const r = settings.arena.size * 0.1;
    this.patrolArea = {
      x: THREE.MathUtils.randInt(-r, r),
      y: THREE.MathUtils.randInt(-r, r),
    };
    this.x = this.patrolArea.x;
    this.y = this.patrolArea.y;
    this.box.x = this.patrolArea.x;
    this.box.y = this.patrolArea.y;

    game.on("player.removed", () => {
      this.targetPlayer = null;
      console.log("[0] removed target player");
    });
    game.on("player.killed", () => {
      this.targetPlayer = null;
      console.log("[1] removed target player");
    });
  }

  update(game: Game) {
    // Find player target
    if (this.targetPlayer === null) {
      for (let p = 0, length = game.players.length; p < length; p++) {
        if (dist(this.box, game.players[p].box) <= this.range) {
          this.targetPlayer = game.players[p];
          break;
        }
      }
    }

    const a = settings.arena.size * 0.5;
    const p = this.speed * 0.5;

    if (this.targetPlayer !== null) {
      const dx = Math.sign(this.targetPlayer.x - this.x);
      const dy = Math.sign(this.targetPlayer.y - this.y);
      this.dx = THREE.MathUtils.lerp(this.dx, dx, this.lerp);
      this.dy = THREE.MathUtils.lerp(this.dy, dy, this.lerp);
      this.rotation =
        Math.atan2(this.y - this.targetPlayer.y, this.x - this.targetPlayer.x) +
        MathUtils.degToRad(90);
      this.x = THREE.MathUtils.clamp(
        this.x + this.speed * this.dx,
        -a + p,
        a - p
      );
      this.y = THREE.MathUtils.clamp(
        this.y + this.speed * this.dy,
        -a + p,
        a - p
      );
      this.box.x = this.x;
      this.box.y = this.y;
      return;
    }

    this.dx = 0;
    this.dy = 0;
  }
}
