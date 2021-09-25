import geckos from "@geckos.io/client";
import config from "../config";
import { useAppStore } from "../state/use-app-store";

const channel = geckos({ url: config.apiUrl, port: null });

type Data = string | number | Object | null;

const server = {
  connected: false,
  id: "",
  emit(eventName: string, data?: Data, options?: any) {
    if (!server.connected) return;
    channel.emit(eventName, data, options);
  },
  on(eventName: string, fn: (data: Data) => void) {
    if (!server.connected) return;
    channel.on(eventName, fn);
  },
};

channel.onConnect((err) => {
  if (err) {
    return console.error(err);
  }
  console.log("connected");
  server.id = channel.id;
  server.connected = true;
  useAppStore.getState().setConnected(true);
});

channel.onDisconnect((err) => {
  if (err) {
    return console.error(err);
  }
  console.log("disconnected");
  server.connected = false;
  useAppStore.getState().setConnected(false);
});

window.addEventListener("unload", () => {
  server.emit("disconnect");
});

export default server;
