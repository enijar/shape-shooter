import type { Response } from "express";
import { ApiRequest } from "../config/types";

export default function test(req: ApiRequest, res: Response) {
  res.json({ test: true });
}
