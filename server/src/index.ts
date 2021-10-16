import config from "./config";
import server from "./services/server";
import Game from "./game/game";
import Player from "./game/entities/player";

const game = new Game();
game.start(() => {
  server.emit("tick", game.getState());
});

type PlayerData = {
  name: string;
};

server.on("connection", (socket) => {
  const player = new Player(socket.id);

  socket.on("player.join", (playerData: PlayerData) => {
    if (typeof playerData.name !== "string") return;
    if (playerData.name.trim().length === 0) return;
    player.name = playerData.name;
    player.fresh();
    game.addPlayer(player);
    socket.emit("connected", { player, ...game.getState() });
    server.emit("player.connected", player);
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
