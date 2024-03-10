import pkg from "pg";
const { Pool } = pkg;

const { PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD } = process.env;

export const database = new Pool({
  host: PG_HOST,
  database: PG_DATABASE,
  user: PG_USER,
  password: PG_PASSWORD,
  port: 5432,
  ssl: true,
});
