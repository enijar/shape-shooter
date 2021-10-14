import config from "./config";
import server from "./services/server";
import Game from "./game/game";
import Player from "./game/entities/player";

const game = new Game();
game.start(() => {
  server.emit("tick", game.getState());
});

server.on("connection", (socket) => {
  const player = new Player(socket.id);
  game.addPlayer(player);

  server.emit("player.connected", player);
  socket.emit("connected", { player, ...game.getState() });

  socket.on("player.update.name", (name: string) => {
    player.name = name ?? "Noob";
    player.inGame = true;
    server.emit("player.connected", player);
    socket.emit(
      "connected",
      { player, ...game.getState() },
      { reliable: true }
    );
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
    game.removePlayer(player);
    server.emit("player.disconnected", player);
  });
});

server.listen(config.port);

console.log(`Server running: http://localhost:${config.port}`);

server.on("close", () => {
  console.log("Closing down gracefully...");
  game.destroy();
});
