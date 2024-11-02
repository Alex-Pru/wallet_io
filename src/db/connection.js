import knex from "knex";
import { ConnectSessionKnexStore } from "connect-session-knex";
import * as dotenv from "dotenv";

dotenv.config();

const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
};

export const connection = knex({
  client: "mysql2",
  connection: options,
  migrations: {
    directory: "./src/db/migrations",
  },
});

export const sessionStore = new ConnectSessionKnexStore({
  knex: connection,
});
