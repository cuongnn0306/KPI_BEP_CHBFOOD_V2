import { query } from "@/lib/db";
import { getJson, ok } from "@/lib/http";
import { NextRequest } from "next/server";

export async function GET() {
  const rows = await query("select * from ingredients order by name");
  return ok(rows);
}

export async function POST(req: NextRequest) {
  const body = await getJson<{ name: string; unit: string; conversion_factor?: number; conversion_unit?: string }>(req);
  const rows = await query(
    "insert into ingredients(name, unit, conversion_factor, conversion_unit) values ($1,$2,$3,$4) returning *",
    [body.name, body.unit, body.conversion_factor ?? 1, body.conversion_unit ?? null]
  );
  return ok(rows[0], 201);
}
