import { Pool } from "pg";

const globalForPg = global as unknown as { pool?: Pool };

export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/kitchen_planner"
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool;
}

export async function query<T>(text: string, params: unknown[] = []) {
  const result = await pool.query<T>(text, params);
  return result.rows;
}
