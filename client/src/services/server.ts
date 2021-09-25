import geckos from "@geckos.io/client";
import config from "../config";
import { useAppStore } from "../state/use-app-store";

const channel = geckos({ url: config.apiUrl, port: null });

type Data = string | number | Object | null;

const server = {
  id: "",
  emit(eventName: string, data?: Data, options?: any) {
    channel.emit(eventName, data, options);
  },
  on(eventName: string, fn: (data: Data) => void) {
    channel.on(eventName, fn);
  },
};

channel.onConnect((err) => {
  if (err) {
    return console.error(err);
  }
  server.id = channel.id;
  useAppStore.getState().setConnected(true);
});

channel.onDisconnect((err) => {
  if (err) {
    return console.error(err);
  }
  useAppStore.getState().setConnected(false);
});

window.addEventListener("unload", () => {
  server.emit("disconnect");
});

export default server;
