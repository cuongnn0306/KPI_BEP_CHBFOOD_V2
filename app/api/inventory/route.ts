import { query } from "@/lib/db";
import { getJson, ok } from "@/lib/http";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return ok([]);
  const rows = await query(
    `select inv.*, i.name as ingredient_name, i.unit
     from inventory inv
     join ingredients i on i.id = inv.ingredient_id
     where date = $1
     order by i.name`,
    [date]
  );
  return ok(rows);
}

export async function POST(req: NextRequest) {
  const body = await getJson<{ ingredient_id: number; quantity: number; date: string }>(req);
  const rows = await query(
    `insert into inventory(ingredient_id, quantity, date)
     values ($1,$2,$3)
     on conflict (ingredient_id, date)
     do update set quantity = excluded.quantity
     returning *`,
    [body.ingredient_id, body.quantity, body.date]
  );
  return ok(rows[0], 201);
}
