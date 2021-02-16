import {
  Bullet,
  ConnectedPayload,
  EngineActionType,
  MovedPayload,
  Player,
  RotatedPayload,
  Shape,
} from "../types";

type ConnectPayload = {
  name: string;
  shape: Shape;
  color: string;
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
  payload?: ConnectPayload | RotatePayload | MovePayload;
};

type State = {
  players: Player[];
};

type Subscription = {
  type: EngineActionType;
  fn: (payload: ConnectedPayload | RotatedPayload | MovedPayload) => void;
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
function createEngine(tps: number = 0) {
  let nextPlayerIndex = 0;
  const state: State = {
    players: createEntityBuffer<Player>(MAX_PLAYERS, {
      id: -1,
      shape: Shape.triangle,
      color: "#ff0000",
      name: "",
      x: 0,
      y: 0,
      r: 0,
      bullets: createEntityBuffer<Bullet>(MAX_PLAYER_BULLETS, {
        id: -1,
        playerId: -1,
        x: 0,
        y: 0,
        r: 0,
      }),
    }),
  };
  const subscriptions: Subscription[] = [];
  const actionQueue: ActionQueueItem[] = [];
  let totalPlayers = 0;
  let totalPlayerBullets = 0;

  for (let i = 0, length = state.players.length; i < length; i++) {
    totalPlayers++;
    totalPlayerBullets += state.players[i].bullets.length;
  }

  function on(
    type: EngineActionType,
    fn: (payload: ConnectedPayload | RotatedPayload | MovedPayload) => void
  ) {
    subscriptions.push({ type, fn });
  }

  function emit(
    type: EngineActionType,
    payload?: ConnectPayload | RotatePayload | MovePayload
  ) {
    actionQueue.unshift({ type, payload });
  }

  function off(type: EngineActionType, fn: Function) {
    // todo remove subscription
  }

  let timeout: NodeJS.Timeout;

  function tick(fn?: TickFn) {
    for (let i = 0, length = actionQueue.length; i < length; i++) {
      const action = actionQueue[i];

      if (!action) {
        continue;
      }

      let connectedPlayerId: number = -1;

      if (action.type === EngineActionType.connect) {
        const payload = action.payload as ConnectPayload;
        // todo connect player to sockets
        connectedPlayerId = nextPlayerIndex + 1;
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
        for (
          let i = 0, length = state.players[nextPlayerIndex].bullets.length;
          i < length;
          i++
        ) {
          state.players[nextPlayerIndex].bullets[i].id = -1;
          state.players[nextPlayerIndex].bullets[
            i
          ].playerId = connectedPlayerId;
          state.players[nextPlayerIndex].x = 0;
          state.players[nextPlayerIndex].y = 0;
          state.players[nextPlayerIndex].r = 0;
        }
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
        // state.players[payload.playerId].bullets = [];
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
        if (action.type === EngineActionType.rotate) {
          const payload = action.payload as RotatePayload;
          subscriptions[i].fn({
            playerId: payload.playerId,
            r: state.players[payload.playerId].r,
          });
        }
        if (action.type === EngineActionType.move) {
          const payload = action.payload as MovePayload;
          subscriptions[i].fn({
            playerId: payload.playerId,
            x: state.players[payload.playerId].x,
            y: state.players[payload.playerId].y,
          });
        }
        if (action.type === EngineActionType.shoot) {
          const payload = action.payload as ShootPayload;
          subscriptions[i].fn({
            playerId: payload.playerId,
            players: state.players,
          });
        }
      }

      connectedPlayerId = -1;
      actionQueue.splice(i, 1);
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
    on,
    emit,
    off,
    start(fn?: TickFn) {
      tick(fn);
    },
    destroy() {
      clearTimeout(timeout);
    },
  };
}

export default createEngine();
