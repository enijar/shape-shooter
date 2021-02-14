import { resolve } from "path";
import env from "../../env";

export default {
  port: env.port,
  database: {
    name: env.database.name,
    dialect: env.database.dialect,
    username: env.database.username,
    password: env.database.password,
    entities: resolve("src", "entities"),
  },
  jwt: {
    secret: env.jwt.secret,
  },
};
