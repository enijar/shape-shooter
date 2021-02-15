import { NewPlayer } from "../../client/src/shared/types";
import config from "./config/config";
import database from "./services/database";
import { http, socket as io } from "./services/app";
import engine, { GameEngineContext } from "../../client/src/shared/game/engine";

(async () => {
  try {
    await database.sync({ alter: true });

    engine.context = GameEngineContext.server;
    engine.io = io;

    io.on("connection", (socket) => {
      let playerId: number = -1;

      engine.socket = socket;

      socket.on("newPlayer.connect", (newPlayer: NewPlayer) => {
        playerId = engine.addNewPlayer(newPlayer);
      });

      socket.on("disconnect", () => {
        engine.removePlayer(playerId);
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
