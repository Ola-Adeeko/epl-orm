import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Player } from "./entity/Player";
import { Club } from "./entity/Club";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "password",
  database: "eplorm",
  synchronize: true,
  logging: false,
  entities: [User, Player, Club],
  migrations: [],
  subscribers: [],
});
