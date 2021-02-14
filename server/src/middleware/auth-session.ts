import { JsonWebTokenError, verify } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import config from "../config/config";
import User from "../entities/user";

export default async function authSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore
    const { email = "" } = await verify(
      req.cookies.get("authToken") ?? "",
      config.jwt.secret
    );

    const user = await User.findOne({ where: { email } });

    if (user === null) {
      res.status(401).json({ errors: { server: "Unauthorised" } });
    } else {
      // @ts-ignore
      req.user = user;
      next();
    }
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({ errors: { server: "Unauthorised" } });
    } else {
      console.error(err);
      res.status(500).json({ errors: { server: "Server error" } });
    }
  }
}
