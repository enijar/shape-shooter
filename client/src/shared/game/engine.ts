import * as THREE from "three";
import { Player, Shape, Weapon } from "../types";
import { deg2rad } from "../../game/utils";

type GameEngineState = {
  players: Player[];
  bullets: Float64Array;
};

export enum GameEngineContext {
  server = "server",
  client = "client",
}

let nextFrame: number = -1;
let nextBulletIndex = 0;

const MAX_PLAYERS = 100; // @todo change to 100
const MAX_PLAYER_BULLETS = 100; // @todo change to 100

const raycaster = new THREE.Raycaster();
const playerObject = new THREE.Vector3();
const bulletObject = new THREE.Vector3();

export enum BulletEntityAttributeIndex {
  id,
  playerId,
  active,
  createdAt,
  speed,
  lifetime,
  x,
  y,
  r,
}

export type Entity = {
  array: Float64Array;
  totalAttributes: number;
  get: (index: number, attributeIndex: number) => number;
  set: (index: number, attributeIndex: number, value: number) => void;
};

function createEntities(count: number, attributes: number[]): Entity {
  const array = new Float64Array(Array(count * attributes.length).fill(0));
  const totalAttributes = attributes.length;
  return {
    array,
    totalAttributes,
    get(index, attributeIndex) {
      return array[index + attributeIndex];
    },
    set(index, attributeIndex, value) {
      array.set([value], index + attributeIndex);
    },
  };
}

export const bulletEntities = createEntities(MAX_PLAYERS * MAX_PLAYER_BULLETS, [
  0, // id
  0, // playerId
  0, // active
  0, // createdAt
  0, // speed
  0, // lifetime
  0, // x
  0, // y
  0, // z
]);

const state: GameEngineState = {
  players: [
    {
      id: 1,
      active: true,
      x: 0,
      y: 0,
      r: 0,
      health: 0.8,
      speed: 0.005,
      name: "Enijar",
      shape: Shape.triangle,
      weapon: Weapon.handgun,
      color: "#ff0000",
      lastShotTime: 0,
      shootingSpeed: 0.75,
    },
    {
      id: 2,
      active: true,
      x: 0.25,
      y: 0.25,
      r: deg2rad(-45),
      health: 0.8,
      speed: 0.005,
      name: "Player 2",
      shape: Shape.triangle,
      weapon: Weapon.handgun,
      color: "#00ff00",
      lastShotTime: 0,
      shootingSpeed: 0.75,
    },
  ],
  bullets: bulletEntities.array,
};

for (
  let i = 0, length = state.bullets.length;
  i < length;
  i += bulletEntities.totalAttributes
) {
  bulletEntities.set(i, BulletEntityAttributeIndex.id, i + 1);
}

export type Action = {
  playerId: number;
  type: "move" | "rotate" | "shoot";
  payload: any;
};

function move(playerIndex: number, action: Action, state: GameEngineState) {
  if (action.payload.x.move) {
    state.players[playerIndex].x -=
      action.payload.x.amount * state.players[playerIndex].speed;
  }
  if (action.payload.y.move) {
    state.players[playerIndex].y -=
      action.payload.y.amount * state.players[playerIndex].speed;
  }
}

function rotate(playerIndex: number, action: Action, state: GameEngineState) {
  state.players[playerIndex].r = action.payload.r;
}

function shoot(playerIndex: number, action: Action, state: GameEngineState) {
  const { id, x, y, r } = state.players[playerIndex];
  bulletEntities.set(nextBulletIndex, BulletEntityAttributeIndex.playerId, id);
  bulletEntities.set(nextBulletIndex, BulletEntityAttributeIndex.active, 1);
  bulletEntities.set(
    nextBulletIndex,
    BulletEntityAttributeIndex.lifetime,
    3500
  );
  bulletEntities.set(nextBulletIndex, BulletEntityAttributeIndex.speed, 0.01);
  bulletEntities.set(nextBulletIndex, BulletEntityAttributeIndex.x, x);
  bulletEntities.set(nextBulletIndex, BulletEntityAttributeIndex.y, y);
  bulletEntities.set(nextBulletIndex, BulletEntityAttributeIndex.r, r);
  bulletEntities.set(
    nextBulletIndex,
    BulletEntityAttributeIndex.createdAt,
    Date.now()
  );
  nextBulletIndex += bulletEntities.totalAttributes;
  if (nextBulletIndex === state.bullets.length) {
    nextBulletIndex = 0;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  state,
  context: GameEngineContext.client,
  destroy() {
    cancelAnimationFrame(nextFrame);
  },
  action(action: Action) {
    const index = this.state.players.findIndex(
      ({ id }) => id === action.playerId
    );
    if (index === -1) return;
    switch (action.type) {
      case "move":
        move(index, action, this.state);
        break;
      case "rotate":
        rotate(index, action, this.state);
        break;
      case "shoot":
        shoot(index, action, this.state);
        break;
    }
  },
  update() {
    const now = Date.now();

    for (
      let i = 0, length = this.state.bullets.length;
      i < length;
      i += bulletEntities.totalAttributes
    ) {
      if (bulletEntities.get(i, BulletEntityAttributeIndex.active) === 0) {
        continue;
      }
      // Remove old bullets
      if (
        now - bulletEntities.get(i, BulletEntityAttributeIndex.createdAt) >=
        bulletEntities.get(i, BulletEntityAttributeIndex.lifetime)
      ) {
        bulletEntities.set(i, BulletEntityAttributeIndex.active, 0);
        continue;
      }

      const speed = bulletEntities.get(i, BulletEntityAttributeIndex.speed);
      const x = bulletEntities.get(i, BulletEntityAttributeIndex.x);
      const y = bulletEntities.get(i, BulletEntityAttributeIndex.y);
      const r = bulletEntities.get(i, BulletEntityAttributeIndex.r);

      // for (let j = 0; j < this.state.players.length; j++) {
      //   playerObject.set(this.state.players[j].x, this.state.players[j].y, 0);
      //   bulletObject.set(x, y, 0);
      //   raycaster.ray.set(playerObject, bulletObject);
      //   raycaster.intersectObjects();
      // }
      // Update bullet position using rotation(z) as the angle of direction:
      // angle = rotation(z)
      // x = x + speed * sin(-angle);
      // y = y + speed * cos(-angle);
      bulletEntities.set(
        i,
        BulletEntityAttributeIndex.x,
        x + speed * Math.sin(-r)
      );
      bulletEntities.set(
        i,
        BulletEntityAttributeIndex.y,
        y + speed * Math.cos(-r)
      );
    }

    return this.state;
  },
};
