import io from "socket.io-client";
import config from "../config/config";

const client: SocketIOClient.Socket = io(config.serverUrl, {
  autoConnect: false,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  connect(): SocketIOClient.Socket {
    return client.connect();
  },
  disconnect() {
    client.disconnect();
  },
  on(event: string, fn: Function) {
    client.on(event, fn);
  },
  off(event: string, fn?: Function) {
    client.off(event, fn);
  },
  emit(event: string, data?: any) {
    client.emit(event, data);
  },
};
