import {
  ConnectedPayload,
  DisconnectedPayload,
  EngineActionType,
  MovedPayload,
  RotatedPayload,
  Shape,
  ShotPayload,
  TickedPayload,
} from "../types";
import state from "./state";
import { createEntityBuffer } from "./utils";

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

type Subscription = {
  type: EngineActionType;
  fn: (
    payload?:
      | ConnectedPayload
      | TickedPayload
      | RotatedPayload
      | MovedPayload
      | ShotPayload
      | DisconnectedPayload
  ) => void;
};

// todo change tps to 60 (higher tps is a petter player experience but causes higher CPU usage)
function createEngine(tps: number = 60) {
  let nextPlayerIndex = 0;
  let nextBulletIndex = 0;
  let nextQueueIndex = 0;
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
        | TickedPayload
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

  function tick() {
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
        const payload = action.payload as ShootPayload;
        const { x, y, r } = state.players[payload.playerId];
        state.bullets[nextBulletIndex].playerId = payload.playerId;
        state.bullets[nextBulletIndex].id = nextBulletIndex;
        state.bullets[nextBulletIndex].x = x;
        state.bullets[nextBulletIndex].y = y;
        state.bullets[nextBulletIndex].r = r;
        state.bullets[nextBulletIndex].sX = x;
        state.bullets[nextBulletIndex].sY = y;
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
    const bulletMaxDistance = 2;
    for (let i = 0, length = state.bullets.length; i < length; i++) {
      if (state.bullets[i].id === -1) continue;
      const { sX, sY, r } = state.bullets[i];
      state.bullets[i].x += bulletVelocity * Math.sin(-r);
      state.bullets[i].y += bulletVelocity * Math.cos(-r);
      const x = sX - state.bullets[i].x;
      const y = sY - state.bullets[i].y;
      const d = Math.sqrt(x * x + y * y);
      if (d > bulletMaxDistance) {
        state.bullets[i].id = -1;
      }
    }

    for (let i = 0, length = subscriptions.length; i < length; i++) {
      if (subscriptions[i].type === EngineActionType.tick) {
        // todo optimise the amount of data sent (when sending from server to client)
        subscriptions[i].fn({
          players: state.players,
          bullets: state.bullets,
        });
      }
    }

    timeout = setTimeout(tick, 1000 / tps);
  }

  return {
    totalPlayers,
    totalPlayerBullets,
    on,
    emit,
    off,
    start() {
      tick();
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
        state.bullets[i].x = 0;
        state.bullets[i].y = 0;
        state.bullets[i].r = 0;
      }
    },
  };
}

export default createEngine();
