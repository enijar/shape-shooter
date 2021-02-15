import io from "socket.io-client";
import config from "../config/config";

const socket: SocketIOClient.Socket = io(config.serverUrl, {
  autoConnect: false,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  connect() {
    socket.connect();
  },
  disconnect() {
    socket.disconnect();
  },
  on(event: string, fn: Function) {
    socket.on(event, fn);
  },
  off(event: string, fn?: Function) {
    socket.off(event, fn);
  },
  emit(event: string, data?: any) {
    socket.emit(event, data);
  },
};
