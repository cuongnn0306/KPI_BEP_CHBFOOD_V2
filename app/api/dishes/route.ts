import { query } from "@/lib/db";
import { getJson, ok } from "@/lib/http";
import { NextRequest } from "next/server";

export async function GET() {
  const rows = await query("select * from dishes order by name");
  return ok(rows);
}

export async function POST(req: NextRequest) {
  const body = await getJson<{ name: string }>(req);
  const rows = await query("insert into dishes(name) values ($1) returning *", [body.name]);
  return ok(rows[0], 201);
}
