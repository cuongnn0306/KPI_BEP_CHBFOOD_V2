import { calculateKPI } from "@/lib/calculation";
import { query } from "@/lib/db";
import { ok } from "@/lib/http";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const startTime = req.nextUrl.searchParams.get("startTime") ?? "06:00";
  if (!date) return ok({ tasks: [], totalMinutes: 0, startTime, finishTime: startTime });

  const [ingredients, dishes, recipes, inventory, forecast, capacities] = await Promise.all([
    query("select * from ingredients"),
    query("select * from dishes"),
    query("select * from recipe"),
    query("select * from inventory where date = $1", [date]),
    query("select * from forecast where date = $1", [date]),
    query("select * from kitchen_capacity")
  ]);

  const result = calculateKPI({ ingredients, dishes, recipes, inventory, forecast, capacities, startTime });
  return ok(result);
}
