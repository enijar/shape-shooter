import config from "./config/config";
import app from "./services/app";

app.listen(config.port, () => {
  console.log(`Server running http://localhost:${config.port}`);
});
