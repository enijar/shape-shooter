import config from "./config/config";
import database from "./services/database";
import { http, socket, socket as io } from "./services/app";
import Game from "./game/game";
import Player from "./game/entities/player";

(async () => {
  try {
    await database.sync({ alter: true });

    const game = new Game(socket);
    game.start();

    // todo: type definitions
    io.on("connection", (socket) => {
      let currentPlayer: Player = null;
      console.log(`[${socket.id}] connected`);

      socket.on("game.join", (player: any) => {
        console.log(`[${socket.id}] game.join`);
        currentPlayer = game.addPlayer(player.name, player.shape, player.color);
        socket.emit("game.joined", {
          currentPlayer: currentPlayer.encode(),
          players: game.players.map((player) => player.encode()),
        });
      });

      socket.on("game.leave", () => {
        console.log(`[${socket.id}] game.leave`);
        if (currentPlayer !== null) {
          game.removePlayer(currentPlayer.id);
        }
      });

      socket.on("controls", (controls: any) => {
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
        console.log(`[${socket.id}] disconnected`);
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
