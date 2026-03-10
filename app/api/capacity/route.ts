import { query } from "@/lib/db";
import { getJson, ok } from "@/lib/http";
import { NextRequest } from "next/server";

export async function GET() {
  const rows = await query(
    `select kc.*, i.name as ingredient_name, i.unit
     from kitchen_capacity kc
     join ingredients i on i.id = kc.ingredient_id
     order by i.name`
  );
  return ok(rows);
}

export async function POST(req: NextRequest) {
  const body = await getJson<{ ingredient_id: number; batch_size: number; batch_time_minutes: number }>(req);
  const rows = await query(
    `insert into kitchen_capacity(ingredient_id, batch_size, batch_time_minutes)
     values ($1,$2,$3)
     on conflict (ingredient_id)
     do update set batch_size = excluded.batch_size, batch_time_minutes = excluded.batch_time_minutes
     returning *`,
    [body.ingredient_id, body.batch_size, body.batch_time_minutes]
  );
  return ok(rows[0], 201);
}
