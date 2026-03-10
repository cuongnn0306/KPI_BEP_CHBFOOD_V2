"use client";

import { NumericKeypadInput } from "@/components/NumericKeypadInput";
import { useEffect, useState } from "react";

type Dish = { id: number; name: string };

export default function ForecastPage() {
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [rows, setRows] = useState<Record<number, number>>({});
  const [newDish, setNewDish] = useState("");

  const load = () => fetch("/api/dishes").then((r) => r.json()).then(setDishes);
  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    fetch(`/api/forecast?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        const next: Record<number, number> = {};
        data.forEach((line: { dish_id: number; forecast_quantity: number }) => {
          next[line.dish_id] = line.forecast_quantity;
        });
        setRows(next);
      });
  }, [date]);

  const save = (dish_id: number) =>
    fetch("/api/forecast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dish_id, forecast_quantity: rows[dish_id] ?? 0, date })
    });

  const addDish = async () => {
    if (!newDish.trim()) return;
    await fetch("/api/dishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newDish.trim() })
    });
    setNewDish("");
    load();
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Forecast Next Day Sales</h2>
      <input type="date" className="w-full border bg-white p-3" value={date} onChange={(e) => setDate(e.target.value)} />
      <div className="flex gap-2">
        <input className="flex-1 border bg-white p-3" value={newDish} onChange={(e) => setNewDish(e.target.value)} placeholder="New dish name" />
        <button className="bg-brand px-4 text-white" onClick={addDish}>+ Add Dish</button>
      </div>
      {dishes.map((item) => (
        <div key={item.id} className="grid grid-cols-[1fr,130px,80px] items-center gap-2 rounded-xl bg-white p-3 shadow">
          <span className="font-medium">{item.name}</span>
          <NumericKeypadInput value={rows[item.id] ?? 0} onChange={(val) => setRows((prev) => ({ ...prev, [item.id]: val }))} />
          <button className="bg-brand p-3 text-sm font-semibold text-white" onClick={() => save(item.id)}>
            Save
          </button>
        </div>
      ))}
    </div>
  );
}
