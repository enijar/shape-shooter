export enum EngineContext {
  client,
  server,
}

export type EngineConfig = {
  maxPlayers: number;
  maxBulletsPerPlayer: number;
  context: EngineContext;
  tps: number;
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

  const state: EngineState = {
    // Actions sent in by players
    actions: createEntityBuffer<EngineAction>(config.maxPlayers * 10, {
      playerId: -1,
      type: ActionType.idle,
    }),
    // Currently connected players with their states
    players: createEntityBuffer<EnginePlayer>(config.maxPlayers, {
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
    }),
    // Bullets fired by players
    bullets: createEntityBuffer<EngineBullet>(
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
    ),
    subscriptions: [],
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

  let nextPlayerIndex = 0;
  let nextBulletIndex = 0;
  const playerFireInterval = 250; // ms
  const maxBulletDistance = 2;
  const playerVelocity = 0.0075;
  const bulletVelocity = 0.01;
  function update(now: number): EngineEvent[] {
    const events: EngineEvent[] = [];
    // Apply updates
    for (let i = 0, length = state.players.length; i < length; i++) {
      // Handle player movement
      // todo clamp player x,y to ensure they stay within the bounds of the arena
      let velocity = playerVelocity;
      if (state.players[i].moveX !== 0 && state.players[i].moveY !== 0) {
        // Move slower if this player is moving diagonally
        velocity *= 0.75;
      }
      state.players[i].x += velocity * state.players[i].moveX;
      state.players[i].y -= velocity * state.players[i].moveY;
      // Handle player firing
      const canFire = now - state.players[i].lastFireTime >= playerFireInterval;
      if (state.players[i].firing && canFire) {
        state.players[i].lastFireTime = now;
        state.bullets[nextBulletIndex].id = nextBulletIndex;
        state.bullets[nextBulletIndex].sX = state.players[i].x;
        state.bullets[nextBulletIndex].sY = state.players[i].y;
        state.bullets[nextBulletIndex].x = state.players[i].x;
        state.bullets[nextBulletIndex].y = state.players[i].y;
        state.bullets[nextBulletIndex].r = state.players[i].r;
        // Re-use existing bullet objects by cycling through them
        if (++nextBulletIndex === state.bullets.length) {
          nextBulletIndex = 0;
        }
      }
    }
    for (let i = 0, length = state.bullets.length; i < length; i++) {
      state.bullets[i].x += bulletVelocity * Math.sin(-state.bullets[i].r);
      state.bullets[i].y += bulletVelocity * Math.cos(-state.bullets[i].r);
      const a = state.bullets[i].sX - state.bullets[i].x;
      const b = state.bullets[i].sY - state.bullets[i].y;
      const d = Math.sqrt(a * a + b * b);
      if (d > maxBulletDistance) {
        state.bullets[i].id = -1;
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
      if (state.players[nextPlayerIndex].id > -1) {
        // todo emit error informing player that the server is full
        return;
      }
      state.players[nextPlayerIndex].id = nextPlayerIndex;
      state.players[nextPlayerIndex].name = playerName;
      state.players[nextPlayerIndex].shape = shape;
      state.players[nextPlayerIndex].color = color;
      emit([
        {
          event: "connected",
          payload: {
            player: { ...state.players[nextPlayerIndex] },
            players: [...state.players],
          },
        },
      ]);
      // Re-use existing player objects by cycling through them
      if (++nextPlayerIndex === state.players.length) {
        nextPlayerIndex = 0;
      }
    },
  };
})();
