import geckos from "@geckos.io/client";
import config from "../config";

const channel = geckos({ url: config.apiUrl, port: 3000 });

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
  server.id = channel.id;
  server.connected = true;
});

channel.onDisconnect((err) => {
  if (err) {
    return console.error(err);
  }
  server.connected = false;
});

window.addEventListener("unload", () => {
  server.emit("disconnect");
});

export default server;
