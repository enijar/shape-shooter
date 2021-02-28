import { Engine, Player, Transport } from "@shape-shooter/shared";
import config from "./config/config";
import { http, socket as io } from "./services/app";

(async () => {
  try {
    const game = new Engine(io);
    game.start();

    // todo: type definitions
    io.on("connection", (socket) => {
      let currentPlayer: Player = null;

      socket.on("game.join", (player: any) => {
        player = Transport.decode(player);
        currentPlayer = game.addPlayer(player.name, player.shape, player.color);
        const players = game.players.map((player) => player.encode());
        socket.emit(
          "game.joined",
          Transport.encode({
            currentPlayer: currentPlayer.encode(),
            players,
            modifiers: game.modifiers,
            mapSize: game.mapSize,
            mapBounds: game.mapBounds,
          })
        );
      });

      socket.on("game.leave", () => {
        if (currentPlayer !== null) {
          game.removePlayer(currentPlayer.id);
        }
      });

      socket.on("controls", (controls: any) => {
        controls = Transport.decode(controls);
        if (currentPlayer !== null) {
          currentPlayer.moveX = controls.moveX;
          currentPlayer.moveY = controls.moveY;
          currentPlayer.firing = controls.firing;
        }
      });

      socket.on("rotate", (r: number) => {
        if (currentPlayer !== null) {
          currentPlayer.r = r;
        }
      });

      socket.on("disconnect", () => {
        if (currentPlayer !== null) {
          game.removePlayer(currentPlayer.id);
        }
      });
    });

    http.listen(config.port, () => {
      console.log(`Server running: http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
