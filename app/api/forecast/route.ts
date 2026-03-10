import { query } from "@/lib/db";
import { getJson, ok } from "@/lib/http";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return ok([]);
  const rows = await query(
    `select f.*, d.name as dish_name
     from forecast f
     join dishes d on d.id = f.dish_id
     where date = $1
     order by d.name`,
    [date]
  );
  return ok(rows);
}

export async function POST(req: NextRequest) {
  const body = await getJson<{ dish_id: number; forecast_quantity: number; date: string }>(req);
  const rows = await query(
    `insert into forecast(dish_id, forecast_quantity, date)
     values ($1,$2,$3)
     on conflict (dish_id, date)
     do update set forecast_quantity = excluded.forecast_quantity
     returning *`,
    [body.dish_id, body.forecast_quantity, body.date]
  );
  return ok(rows[0], 201);
}
