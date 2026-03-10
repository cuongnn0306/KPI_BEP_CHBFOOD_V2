import { query } from "@/lib/db";
import { getJson, ok } from "@/lib/http";
import { NextRequest } from "next/server";

export async function GET() {
  const rows = await query(
    `select r.*, d.name as dish_name, i.name as ingredient_name, i.unit
     from recipe r
     join dishes d on d.id = r.dish_id
     join ingredients i on i.id = r.ingredient_id
     order by d.name, i.name`
  );
  return ok(rows);
}

export async function POST(req: NextRequest) {
  const body = await getJson<{ dish_id: number; ingredient_id: number; quantity_per_dish: number }>(req);
  const rows = await query(
    `insert into recipe(dish_id, ingredient_id, quantity_per_dish)
     values ($1,$2,$3)
     on conflict (dish_id, ingredient_id)
     do update set quantity_per_dish = excluded.quantity_per_dish
     returning *`,
    [body.dish_id, body.ingredient_id, body.quantity_per_dish]
  );
  return ok(rows[0], 201);
}
