import { clamp } from "./utils";

export enum EngineContext {
  client,
  server,
}

export type EngineConfig = {
  maxPlayers: number;
  maxBulletsPerPlayer: number;
  context: EngineContext;
  tps: number;
  worldW: number;
  worldH: number;
};

export type EngineSubscription = {
  event: string;
  fn: (payload?: any) => void;
};

export type EngineEvent = {
  event: string;
  payload?: any;
};

export type EngineState = {
  actions: EngineAction[];
  players: EnginePlayer[];
  bullets: EngineBullet[];
  subscriptions: EngineSubscription[];
  availablePlayerIndices: number[];
  availableBulletIndices: number[];
};

export enum ActionType {
  move,
  rotate,
  shoot,
  idle,
}

export type EngineAction = {
  playerId: number;
  type: ActionType;
};

export enum EnginePlayerShape {
  circle = "circle",
  square = "square",
  triangle = "triangle",
}

export type EnginePlayer = {
  id: number;
  name: string;
  shape: EnginePlayerShape;
  color: string;
  firing: boolean;
  lastFireTime: number;
  moveX: -1 | 0 | 1; // direction of movement along the X axis
  moveY: -1 | 0 | 1; // direction of movement along the Y axis
  x: number;
  y: number;
  r: number;
};

export type EngineBullet = {
  id: number;
  playerId: number;
  sX: number; // starting X position
  sY: number; // starting Y position
  x: number;
  y: number;
  r: number;
};

const defaultConfig = {
  maxPlayers: 20,
  maxBulletsPerPlayer: 100,
  context: EngineContext.client,
  tps: 60,
  worldW: 2,
  worldH: 2,
};

export default (function createEngine(config: EngineConfig = defaultConfig) {
  config = Object.assign(config ?? {}, defaultConfig);

  // Create a fixed length array of entity objects (avoids heavy GC calls)
  function createEntityBuffer<T>(size: number, entity: T): T[] {
    const buffer: T[] = [];
    for (let i = 0; i < size; i++) {
      buffer.push({ ...entity });
    }
    return buffer;
  }

  const playersBuffer = createEntityBuffer<EnginePlayer>(config.maxPlayers, {
    id: -1,
    name: "",
    shape: EnginePlayerShape.triangle,
    color: "#ff0000",
    firing: false,
    lastFireTime: 0,
    moveX: 0,
    moveY: 0,
    x: 0,
    y: 0,
    r: 0,
  });
  const bulletsBuffer = createEntityBuffer<EngineBullet>(
    config.maxPlayers * config.maxBulletsPerPlayer,
    {
      id: -1,
      playerId: -1,
      sX: 0,
      sY: 0,
      x: 0,
      y: 0,
      r: 0,
    }
  );

  const state: EngineState = {
    // Actions sent in by players
    actions: createEntityBuffer<EngineAction>(config.maxPlayers * 10, {
      playerId: -1,
      type: ActionType.idle,
    }),
    // Currently connected players with their states
    players: playersBuffer,
    // Bullets fired by players
    bullets: bulletsBuffer,
    subscriptions: [],
    availablePlayerIndices: playersBuffer.map((_, index) => index),
    availableBulletIndices: bulletsBuffer.map((_, index) => index),
  };

  // Emit updates to all players
  function emit(events: EngineEvent[] = []) {
    // todo emit socket event to players
    for (let i = 0, iLength = events.length; i < iLength; i++) {
      for (let j = 0, jLength = state.subscriptions.length; j < jLength; j++) {
        if (events[i].event === state.subscriptions[j].event) {
          state.subscriptions[j].fn(events[i].payload);
        }
      }
    }
  }

  const playerMinX = -config.worldW / 2;
  const playerMaxX = config.worldW / 2;
  const playerMinY = -config.worldH / 2;
  const playerMaxY = config.worldH / 2;
  const playerFireInterval = 250; // ms
  const maxBulletDistance = 2;
  const playerVelocity = 0.003;
  const bulletVelocity = 0.006;
  let lastUpdateTime = Date.now();
  function update(now: number): EngineEvent[] {
    const delta = Math.max(1, now - lastUpdateTime);
    lastUpdateTime = now;
    // For skipped frames or on slower machines this will be used to move forward in time.
    // 1 is the default time step if the timeout calls are in sync with the tps.
    // This number will be higher the more out of time drift there is between timeout calls.
    const ts = delta / tps;
    const events: EngineEvent[] = [];
    // Apply updates
    for (let i = 0, length = state.players.length; i < length; i++) {
      if (state.players[i].id === -1) continue;
      // Handle player movement
      let velocity = playerVelocity;
      if (state.players[i].moveX !== 0 && state.players[i].moveY !== 0) {
        // Move slower if this player is moving diagonally
        velocity *= 0.75;
      }
      state.players[i].x += velocity * ts * state.players[i].moveX;
      state.players[i].y -= velocity * ts * state.players[i].moveY;
      state.players[i].x = clamp(state.players[i].x, playerMinX, playerMaxX);
      state.players[i].y = clamp(state.players[i].y, playerMinY, playerMaxY);
      // Handle player firing
      const canFire = now - state.players[i].lastFireTime >= playerFireInterval;
      if (state.players[i].firing && canFire) {
        const index = state.availableBulletIndices[0];
        state.availableBulletIndices.splice(0, 1);
        state.players[i].lastFireTime = now;
        state.bullets[index].id = index;
        state.bullets[index].sX = state.players[i].x;
        state.bullets[index].sY = state.players[i].y;
        state.bullets[index].x = state.players[i].x;
        state.bullets[index].y = state.players[i].y;
        state.bullets[index].r = state.players[i].r;
      }
    }
    for (let i = 0, length = state.bullets.length; i < length; i++) {
      if (state.bullets[i].id === -1) continue;
      state.bullets[i].x += bulletVelocity * ts * Math.sin(-state.bullets[i].r);
      state.bullets[i].y += bulletVelocity * ts * Math.cos(-state.bullets[i].r);
      const a = state.bullets[i].sX - state.bullets[i].x;
      const b = state.bullets[i].sY - state.bullets[i].y;
      const d = Math.sqrt(a * a + b * b);
      if (d > maxBulletDistance) {
        state.bullets[i].id = -1;
        // Make player entity available
        state.availableBulletIndices.push(i);
      }
      // todo check for bullet collisions with players and reduce player hp
    }
    return events;
  }

  const tps = 1000 / config.tps;
  let nextTimeout: NodeJS.Timeout;
  function tick() {
    const now = Date.now();
    emit(update(now));
    nextTimeout = setTimeout(tick, tps);
  }

  return {
    state,
    config,
    start: tick,
    stop() {
      clearTimeout(nextTimeout);
    },
    subscribe(event: string, fn: (payload?: any) => void): Function {
      state.subscriptions.push({ event, fn });
      const subscriptionIndex = state.subscriptions.length - 1;
      return () => {
        state.subscriptions.splice(subscriptionIndex, 1);
      };
    },
    playerRotate(playerId: number, r: number) {
      state.players[playerId].r = r;
    },
    playerMove(playerId: number, moveX: -1 | 0 | 1, moveY: -1 | 0 | 1) {
      state.players[playerId].moveX = moveX;
      state.players[playerId].moveY = moveY;
    },
    playerFire(playerId: number, firing: boolean) {
      state.players[playerId].firing = firing;
    },
    connect(playerName: string, shape: EnginePlayerShape, color: string) {
      if (state.availablePlayerIndices.length === 0) {
        // todo emit error informing player that the server is full
        return;
      }
      const index = state.availablePlayerIndices[0];
      state.availablePlayerIndices.splice(0, 1);
      state.players[index].id = index;
      state.players[index].name = playerName;
      state.players[index].shape = shape;
      state.players[index].color = color;
      emit([
        {
          event: "connected",
          payload: {
            player: { ...state.players[index] },
            players: [...state.players],
          },
        },
      ]);
      // Make player entity available
      state.availablePlayerIndices.push(index);
    },
  };
})();
