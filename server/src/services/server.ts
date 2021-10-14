import { Server } from "socket.io";
import config from "../config";

const server = new Server({
  path: "/api",
  cors: {
    origin: config.appUrl,
  },
});

export default server;
