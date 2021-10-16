import * as THREE from "three";
import { MathUtils } from "three";
import { AiMissileEntity, dist, PlayerEntity, settings } from "@app/shared";
import Game from "../game";
import { Box } from "../types";
import { intersect } from "../utils";

type Target = {
  box: Box;
  type: "player" | "origin";
  entity?: PlayerEntity;
};

const DEFAULT_ORIGIN: Box = { x: 0, y: 0, width: 0, height: 0 };

export default class AiMissile extends AiMissileEntity {
  private lerp = 0.05;
  private range = {
    min: Math.max(Math.min(200, settings.arena.size * 0.05), 200),
    max: 150,
  };
  private target: Target = {
    box: DEFAULT_ORIGIN,
    type: "origin",
    entity: null,
  };
  private origin: Box = DEFAULT_ORIGIN;
  private damageInterval = 400;
  private lastDamageTime = 0;

  constructor(game: Game) {
    super();
    const r = settings.arena.size * 0.1;
    this.origin = {
      x: THREE.MathUtils.randInt(-r, r),
      y: THREE.MathUtils.randInt(-r, r),
      width: 0,
      height: 0,
    };
    this.target.box = this.origin;
    this.x = this.origin.x - THREE.MathUtils.randInt(-5, 5);
    this.y = this.origin.y - THREE.MathUtils.randInt(-5, 5);
    this.box.x = this.x;
    this.box.y = this.y;

    game.on("player.removed", () => {
      this.target.box = this.origin;
      this.target.type = "origin";
      this.target.entity = null;
    });
    game.on("player.killed", () => {
      this.target.box = this.origin;
      this.target.type = "origin";
      this.target.entity = null;
    });
  }

  update(game: Game) {
    // Find player target
    if (this.target.type !== "player") {
      for (let p = 0, length = game.players.length; p < length; p++) {
        if (dist(this.box, game.players[p].box) <= this.range.min) {
          this.target.box = game.players[p].box;
          this.target.type = "player";
          this.target.entity = game.players[p];
          break;
        }
      }
    }

    const a = settings.arena.size * 0.5;
    const p = this.speed * 0.5;

    const dx = Math.sign(this.target.box.x - this.x);
    const dy = Math.sign(this.target.box.y - this.y);

    this.dx = THREE.MathUtils.lerp(this.dx, dx, this.lerp);
    this.dy = THREE.MathUtils.lerp(this.dy, dy, this.lerp);
    const ox = this.x + this.box.width / 2;
    const oy = this.y + this.box.height / 2;
    const tx = this.target.box.x + this.target.box.width / 2;
    const ty = this.target.box.y + this.target.box.height / 2;
    const atan = Math.atan2(oy - ty, ox - tx);
    if (atan === 0) {
      this.rotation = 0;
    } else {
      this.rotation = atan + MathUtils.degToRad(90);
    }
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

    // Go back to origin when player is out of range
    if (this.target.type === "player") {
      if (dist(this.box, this.target.box) > this.range.max) {
        this.target.box = this.origin;
        this.target.type = "origin";
        this.target.entity = null;
      }
    }

    const now = Date.now();

    // Damage player if hit boxes intersect
    if (this.target.entity !== null && intersect(this.box, this.target.box)) {
      if (now - this.lastDamageTime > this.damageInterval) {
        this.lastDamageTime = now;
        this.target.entity.health = THREE.MathUtils.clamp(
          this.target.entity.health - this.damage,
          0,
          this.target.entity.maxHealth
        );
      }
    }
  }
}
