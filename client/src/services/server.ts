import { io } from "socket.io-client";
import config from "../config";
import { useAppStore } from "../state/use-app-store";

const server = io(config.apiUrl, { path: "/api" });

server.on("connect", () => {
  useAppStore.getState().setConnected(true);
});

server.on("disconnect", () => {
  useAppStore.getState().setConnected(false);
});

export default server;
