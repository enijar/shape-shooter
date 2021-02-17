import {
  Bullet,
  ConnectedPayload,
  DisconnectedPayload,
  EngineActionType,
  MovedPayload,
  Player,
  RotatedPayload,
  Shape,
  ShotPayload,
} from "../types";

type ConnectPayload = {
  name: string;
  shape: Shape;
  color: string;
};

type DisconnectPayload = {
  playerId: number;
};

type MovePayload = {
  playerId: number;
  x: number;
  y: number;
};

type RotatePayload = {
  playerId: number;
  r: number;
};

type ShootPayload = {
  playerId: number;
};

type ActionQueueItem = {
  type: EngineActionType;
  payload?: ConnectPayload | RotatePayload | MovePayload | ShootPayload;
};

type State = {
  players: Player[];
  bullets: Bullet[];
};

type Subscription = {
  type: EngineActionType;
  fn: (
    payload?:
      | ConnectedPayload
      | RotatedPayload
      | MovedPayload
      | ShotPayload
      | DisconnectedPayload
  ) => void;
};

type TickFn = (state: State) => void;

const MAX_PLAYERS = 20;
const MAX_PLAYER_BULLETS = 5;

function createEntityBuffer<T>(size: number, entity: T): T[] {
  const buffer: T[] = [];
  for (let i = 0; i < size; i++) {
    buffer.push({ ...entity });
  }
  return buffer;
}

// todo change tps to 60 (higher tps is a petter player experience but causes higher CPU usage)
function createEngine(tps: number = 60) {
  let nextPlayerIndex = 0;
  let nextBulletIndex = 0;
  let nextQueueIndex = 0;
  const state: State = {
    players: createEntityBuffer<Player>(MAX_PLAYERS, {
      id: -1,
      shape: Shape.triangle,
      color: "#ff0000",
      name: "",
      x: 0,
      y: 0,
      r: 0,
    }),
    bullets: createEntityBuffer<Bullet>(MAX_PLAYERS * MAX_PLAYER_BULLETS, {
      id: -1,
      playerId: -1,
      createdAt: 0,
      x: 0,
      y: 0,
      r: 0,
    }),
  };
  const subscriptions: Subscription[] = [];
  // todo calculate the array buffer size based off of the max players and bullets
  const actionQueue: ActionQueueItem[] = createEntityBuffer<ActionQueueItem>(
    100,
    {
      type: EngineActionType.idle,
    }
  );
  const totalPlayers = state.players.length;
  const totalPlayerBullets = state.bullets.length;

  function on(
    type: EngineActionType,
    fn: (
      payload?:
        | ConnectedPayload
        | RotatedPayload
        | MovedPayload
        | ShotPayload
        | DisconnectedPayload
    ) => void
  ) {
    subscriptions.push({ type, fn });
  }

  function emit(
    type: EngineActionType,
    payload?:
      | ConnectPayload
      | DisconnectPayload
      | RotatePayload
      | MovePayload
      | ShootPayload
  ) {
    actionQueue[nextQueueIndex].type = type;
    actionQueue[nextQueueIndex].payload = payload;
    nextQueueIndex++;
    if (nextQueueIndex === actionQueue.length) {
      nextQueueIndex = 0;
    }
  }

  function off(type: EngineActionType, fn: Function) {
    // todo remove subscription
  }

  let timeout: NodeJS.Timeout;

  function tick(fn?: TickFn) {
    const now = Date.now();
    for (let i = 0, length = actionQueue.length; i < length; i++) {
      const action = actionQueue[i];

      if (!action) {
        continue;
      }

      let connectedPlayerId: number = -1;

      if (action.type === EngineActionType.connect) {
        const payload = action.payload as ConnectPayload;
        // todo connect player to sockets
        connectedPlayerId = nextPlayerIndex;
        if (state.players[nextPlayerIndex].id > -1) {
          // todo re-connect user instead of doing nothing here
          continue;
        }
        state.players[nextPlayerIndex].id = connectedPlayerId;
        state.players[nextPlayerIndex].name = payload.name;
        // todo place player in a random location (within the bounds of the arena)
        state.players[nextPlayerIndex].x = 0;
        state.players[nextPlayerIndex].y = 0;
        state.players[nextPlayerIndex].r = 0;
        nextPlayerIndex++;
        // todo refuse to connect (player count is at max)
        if (nextPlayerIndex === state.players.length) {
          nextPlayerIndex = 0;
        }
      }

      if (action.type === EngineActionType.move) {
        const payload = action.payload as MovePayload;
        const velocity = 0.0075; // todo move to consts file
        const delta =
          payload.x !== 0 && payload.y !== 0 ? velocity * 0.75 : velocity;
        state.players[payload.playerId].x -= payload.x * delta;
        state.players[payload.playerId].y -= payload.y * delta;
      }

      if (action.type === EngineActionType.rotate) {
        const payload = action.payload as RotatePayload;
        state.players[payload.playerId].r = payload.r;
      }

      if (action.type === EngineActionType.shoot) {
        // todo shoot bullet for player
        const payload = action.payload as ShootPayload;
        state.bullets[nextBulletIndex].playerId = payload.playerId;
        state.bullets[nextBulletIndex].id = nextBulletIndex;
        state.bullets[nextBulletIndex].x = state.players[payload.playerId].x;
        state.bullets[nextBulletIndex].y = state.players[payload.playerId].y;
        state.bullets[nextBulletIndex].r = state.players[payload.playerId].r;
        state.bullets[nextBulletIndex].createdAt = now;
        nextBulletIndex++;
        if (nextBulletIndex === state.bullets.length) {
          nextBulletIndex = 0;
        }
      }

      for (let i = 0, length = subscriptions.length; i < length; i++) {
        if (subscriptions[i].type !== action.type) {
          continue;
        }
        if (action.type === EngineActionType.connect) {
          subscriptions[i].fn({
            playerId: connectedPlayerId,
            players: state.players,
          });
        }
        if (action.type === EngineActionType.disconnect) {
          console.log("disconnect");
          const payload = action.payload as DisconnectPayload;
          const playerId = state.players[payload.playerId].id;
          state.players[payload.playerId].id = -1;
          subscriptions[i].fn({ playerId, players: state.players });
        }
      }

      connectedPlayerId = -1;
      actionQueue[i].type = EngineActionType.idle;
      actionQueue[i].payload = undefined;
    }

    // todo move to update function to be iterated over multiple times to improve accuracy (removing the need to rely on exact timeout calls)
    // todo move to consts file
    const bulletVelocity = 0.01;
    const bulletLifetime = 3500;
    for (let i = 0, length = state.bullets.length; i < length; i++) {
      if (state.bullets[i].id === -1) continue;
      if (now - state.bullets[i].createdAt >= bulletLifetime) {
        state.bullets[i].id = -1;
        continue;
      }
      state.bullets[i].x += bulletVelocity * Math.sin(-state.bullets[i].r);
      state.bullets[i].y += bulletVelocity * Math.cos(-state.bullets[i].r);
    }

    timeout = setTimeout(() => {
      if (fn) {
        fn(state);
      }
      tick(fn);
    }, 1000 / tps);
  }

  return {
    totalPlayers,
    totalPlayerBullets,
    state,
    on,
    emit,
    off,
    start(fn?: TickFn) {
      tick(fn);
    },
    destroy() {
      clearTimeout(timeout);
      for (let i = 0, length = state.players.length; i < length; i++) {
        state.players[i].id = -1;
        state.players[i].shape = Shape.triangle;
        state.players[i].color = "#ff0000";
        state.players[i].name = "";
        state.players[i].x = 0;
        state.players[i].y = 0;
        state.players[i].r = 0;
      }
      for (let i = 0, length = state.bullets.length; i < length; i++) {
        state.bullets[i].id = -1;
        state.bullets[i].playerId = -1;
        state.bullets[i].createdAt = 0;
        state.bullets[i].x = 0;
        state.bullets[i].y = 0;
        state.bullets[i].r = 0;
      }
    },
  };
}

export default createEngine();
