import { createServer } from "http";
import * as express from "express";
import { Server as SocketServer } from "socket.io";
import { json } from "body-parser";
import * as cors from "cors";
import router from "./router";
import config from "../config/config";

export const app = express();
export const http = createServer(app);
export const socket = new SocketServer(http, {
  cors: {
    origin: config.clientUrl,
    methods: ["GET", "POST"],
  },
});

app.use(json());
app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(router);
