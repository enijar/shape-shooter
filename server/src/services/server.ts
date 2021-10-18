import { Server } from "socket.io";
import { parser } from "@app/shared";
import config from "../config";

const server = new Server({
  parser,
  path: "/api",
  cors: {
    origin: config.appUrl,
  },
});

export default server;
