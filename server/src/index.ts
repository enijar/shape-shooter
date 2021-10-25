import * as THREE from "three";
import config from "./config";
import server from "./services/server";
import Game from "./game/game";
import Player from "./game/entities/player";

const game = new Game();
game.start(() => {
  // Do something every tick
});

type PlayerData = {
  name: string;
  color: string;
};

server.on("connection", (socket) => {
  const player = new Player(socket.id);
  player.socket = socket;

  socket.on("player.join", (playerData: PlayerData) => {
    if (typeof playerData.name !== "string") return;
    if (playerData.name.trim().length === 0) return;
    if (typeof playerData.color !== "string") return;
    if (playerData.color.trim().length === 0) return;
    const color = new THREE.Color(playerData.color);
    player.name = playerData.name;
    if (color.isColor) {
      player.color = color.getStyle();
    }
    player.fresh();
    game.addPlayer(player);
    socket.emit("connected", {
      player: player.getData(),
      ...game.getState(player),
    });
    server.emit("player.connected", player.getData());
  });

  socket.on("actions", (actions: any) => {
    player.actions = actions;
  });

  socket.on("rotation", (rotation: number) => {
    player.rotation = rotation;
  });

  socket.on("shooting", (shooting: boolean) => {
    player.shooting = shooting;
  });

  socket.on("disconnect", () => {
    server.emit("player.disconnected", player);
    game.removePlayer(player);
  });
});

server.listen(config.port);

server.on("close", () => {
  console.info("Closing down gracefully...");
  game.destroy();
});
