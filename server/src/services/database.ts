import { Sequelize } from "sequelize-typescript";
import config from "../config/config";

export default new Sequelize({
  database: config.database.name,
  dialect: config.database.dialect,
  username: config.database.username,
  password: config.database.password,
  logging: false,
  models: [config.database.entities],
});
