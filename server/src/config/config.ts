import { resolve } from "path";
import env from "../../env";

export default {
  port: env.port ?? 3000,
  database: {
    name: env.database.name ?? "shapes",
    dialect: env.database.dialect ?? "mysql",
    username: env.database.username ?? "shapes",
    password: env.database.password ?? "secret",
    entities: resolve("src", "entities"),
  },
  jwt: {
    secret: env.jwt.secret ?? "secret",
  },
};
