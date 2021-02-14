import type { Dialect } from "sequelize";

export default {
  port: 3000,
  jwt: {
    secret: `secret`,
  },
  clientUrl: `http://localhost:8080`,
  database: {
    name: `shapes`,
    dialect: `mysql` as Dialect,
    username: `shapes`,
    password: `secret`,
  },
};
