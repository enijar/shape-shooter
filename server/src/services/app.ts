import http from "http";
import { Server } from "socket.io";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import config from "../config";

const app = express();

export const server = http.createServer(app);
export const io = new Server(server, {
  path: "/api",
  cors: {
    origin: config.appUrl,
  },
});

app.use(json());
app.use(
  cors({
    origin(origin, next) {
      if (origin && !config.corsOrigins.includes(origin)) {
        return next(new Error("Not allowed by CORS"));
      }
      next(null, true);
    },
    credentials: true,
  })
);

export default app;
