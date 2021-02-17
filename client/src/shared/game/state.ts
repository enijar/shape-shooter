import { Bullet, Player, Shape, State } from "../types";
import { createEntityBuffer } from "./utils";

const MAX_PLAYERS = 20;
const MAX_PLAYER_BULLETS = 5;

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

export default state;
