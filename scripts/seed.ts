import fs from "fs";
import path from "path";
import { pool } from "../lib/db";

async function run() {
  const schema = fs.readFileSync(path.join(process.cwd(), "db/schema.sql"), "utf8");
  const seed = fs.readFileSync(path.join(process.cwd(), "db/seed.sql"), "utf8");
  await pool.query(schema);
  await pool.query(seed);
  console.log("Database seeded successfully");
  await pool.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
