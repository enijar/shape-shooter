import type { Request } from "express";
import type User from "./entities/user";

export type PrivateRequest = Request & {
  user: User;
};

export type Box = {
  width: number;
  height: number;
  x: number;
  y: number;
};
