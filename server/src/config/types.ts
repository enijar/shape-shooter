import type * as Cookies from "cookies";
import type { Request } from "express";
import type User from "../entities/user";

export type ApiRequest = Request & {
  cookies: Cookies;
};

export type AuthRequest = Request &
  ApiRequest & {
    user: User;
  };
