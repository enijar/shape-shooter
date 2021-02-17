import config from "./config/config";
import database from "./services/database";
import { http, socket as io } from "./services/app";

(async () => {
  try {
    await database.sync({ alter: true });

    io.on("connection", (socket) => {
      console.log(socket.id);
    });

    http.listen(config.port, () => {
      console.log(`Server running: http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
