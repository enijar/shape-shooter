import config from "./config";
import database from "./services/database";
import { io, server } from "./services/app";
import Game from "./game/game";
import Player from "./game/entities/player";

(async () => {
  try {
    await database.sync({ alter: true });

    const game = new Game();
    game.start(() => {
      io.emit("tick", game.getState());
    });

    io.onConnection((channel) => {
      const player = new Player(channel.id);
      game.addPlayer(player);

      io.emit("player.connected", player, { reliable: true });
      channel.emit(
        "connected",
        { player, ...game.getState() },
        { reliable: true }
      );

      channel.on("actions", (actions: any) => {
        player.actions = actions;
      });

      channel.on("rotation", (rotation: number) => {
        player.rotation = rotation;
      });

      channel.on("shooting", (shooting: boolean) => {
        player.shooting = shooting;
      });

      channel.on("disconnect", () => {
        game.removePlayer(player);
        io.connectionsManager.connections.delete(channel.id);
        io.emit("player.disconnected", player, { reliable: true });
      });
    });

    server.listen(config.port, () => {
      console.log(`Server running: http://localhost:${config.port}`);
    });

    server.on("close", () => {
      console.log("Closing down gracefully...");
      game.destroy();
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
