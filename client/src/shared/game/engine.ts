import { NewPlayer, Player } from "../types";

type GameEngineState = {
  epoch: number;
  elapsed: number;
  players: Player[];
  bullets: Float32Array;
};

export enum GameEngineContext {
  server = "server",
  client = "client",
}

let nextFrame: number = -1;
let nextBulletIndex: number = 0;
let nextPlayerId: number = 1;

const BULLET_LIFETIME = 3.5;
const BULLET_SPEED = 0.01;

const PLAYER_SPEED = 0.005;

// @todo increase values when compression is in place
const MAX_PLAYERS = 20;
const MAX_PLAYER_BULLETS = 5;

export enum BulletEntityAttributeIndex {
  id,
  playerId,
  active,
  createdAt,
  x,
  y,
  r,
}

export type Entity = {
  array: Float32Array;
  totalAttributes: number;
  get: (index: number, attributeIndex: number) => number;
  set: (index: number, attributeIndex: number, value: number) => void;
};

function createEntities(count: number, attributes: number[]): Entity {
  const array = new Float32Array(Array(count * attributes.length).fill(0));
  const totalAttributes = attributes.length;
  return {
    array,
    totalAttributes,
    get(index, attributeIndex) {
      const i = index + attributeIndex;
      return array[i];
    },
    set(index, attributeIndex, value) {
      const i = index + attributeIndex;
      array.set([value], i);
    },
  };
}

export const bulletEntities = createEntities(MAX_PLAYERS * MAX_PLAYER_BULLETS, [
  0, // id
  0, // playerId
  0, // active
  0, // createdAt
  0, // x
  0, // y
  0, // r
]);

const state: GameEngineState = {
  epoch: 0,
  elapsed: 0,
  players: [],
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
    state.players[playerIndex].x -= action.payload.x.amount * PLAYER_SPEED;
  }
  if (action.payload.y.move) {
    state.players[playerIndex].y -= action.payload.y.amount * PLAYER_SPEED;
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
    BulletEntityAttributeIndex.createdAt,
    state.elapsed
  );
  bulletEntities.set(nextBulletIndex, BulletEntityAttributeIndex.x, x);
  bulletEntities.set(nextBulletIndex, BulletEntityAttributeIndex.y, y);
  bulletEntities.set(nextBulletIndex, BulletEntityAttributeIndex.r, r);
  nextBulletIndex += bulletEntities.totalAttributes;
  if (nextBulletIndex === state.bullets.length) {
    nextBulletIndex = 0;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  state,
  context: GameEngineContext.client,
  io: null as any,
  socket: null as any,
  connect(newPlayer: NewPlayer) {
    if (this.context === GameEngineContext.client && this.socket !== null) {
      this.on("connect", () => {
        this.emit("newPlayer.connect", newPlayer);
      });
      this.socket.connect();
    }
  },
  on(event: string, fn: Function) {
    if (this.context === GameEngineContext.client && this.socket !== null) {
      this.socket.on(event, fn);
    }
  },
  off(event: string, fn?: Function) {
    if (this.context === GameEngineContext.client && this.socket !== null) {
      this.socket.off(event, fn);
    }
  },
  emit(event: string, data?: any) {
    if (this.context === GameEngineContext.client && this.socket !== null) {
      this.socket.emit(event, data);
    }
  },
  disconnect() {
    if (this.context === GameEngineContext.client && this.socket !== null) {
      cancelAnimationFrame(nextFrame);
      this.socket.disconnect();
    }
  },
  action(action: Action) {
    const index = this.state.players.findIndex(
      // @ts-ignore
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
  addNewPlayer(newPlayer: NewPlayer): number {
    if (
      this.context === GameEngineContext.server &&
      this.io !== null &&
      this.socket !== null
    ) {
      const player = {
        id: nextPlayerId,
        active: true,
        x: 0,
        y: 0,
        r: 0,
        health: 0.8,
        name: newPlayer.name,
        shape: newPlayer.shape,
        weapon: newPlayer.weapon,
        color: "#ff0000",
        lastShotTime: 0,
        shootingSpeed: 0.75,
      };
      this.state.players.push(player);
      nextPlayerId++;
      this.socket.emit("engine.connected", player);
      this.io.emit("engine.players", this.state.players);
      return player.id;
    }
    return -1;
  },
  removePlayer(id: number) {
    if (
      this.context === GameEngineContext.server &&
      this.io !== null &&
      this.socket !== null
    ) {
      for (let i = this.state.players.length - 1; i >= 0; i--) {
        if (this.state.players[i].id === id) {
          this.state.players.splice(i, 1);
        }
      }
      this.io.emit("engine.players", this.state.players);
    }
  },
  update() {
    if (this.state.epoch === 0) {
      this.state.epoch = Date.now();
    }

    this.state.elapsed = (Date.now() - this.state.epoch) / 1000;

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
        this.state.elapsed -
          bulletEntities.get(i, BulletEntityAttributeIndex.createdAt) >=
        BULLET_LIFETIME
      ) {
        bulletEntities.set(i, BulletEntityAttributeIndex.active, 0);
        continue;
      }

      const x = bulletEntities.get(i, BulletEntityAttributeIndex.x);
      const y = bulletEntities.get(i, BulletEntityAttributeIndex.y);
      const r = bulletEntities.get(i, BulletEntityAttributeIndex.r);

      // Update bullet position using rotation(z) as the angle of direction:
      // angle = rotation(z)
      // x = x + BULLET_SPEED * sin(-angle);
      // y = y + BULLET_SPEED * cos(-angle);
      bulletEntities.set(
        i,
        BulletEntityAttributeIndex.x,
        x + BULLET_SPEED * Math.sin(-r)
      );
      bulletEntities.set(
        i,
        BulletEntityAttributeIndex.y,
        y + BULLET_SPEED * Math.cos(-r)
      );
    }
  },
};
