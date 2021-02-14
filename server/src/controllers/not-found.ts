import type { Response } from "express";
import { ApiRequest } from "../config/types";

export default function notFound(req: ApiRequest, res: Response) {
  res.status(404).json({ errors: { server: "Not found" } });
}
