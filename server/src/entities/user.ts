import { Column, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "users",
  indexes: [{ unique: true, fields: ["username"] }],
})
export default class User extends Model {
  @Column
  username: string;

  @Column
  password: string;

  toJSON(): object {
    const data = super.toJSON();
    // @ts-ignore
    delete data.password;
    return data;
  }
}
