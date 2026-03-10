"use client";

import { NumericKeypadInput } from "@/components/NumericKeypadInput";
import { useEffect, useState } from "react";

type Ingredient = { id: number; name: string; unit: string };

export default function InventoryPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [rows, setRows] = useState<Record<number, number>>({});

  useEffect(() => {
    fetch("/api/ingredients").then((r) => r.json()).then(setIngredients);
  }, []);

  useEffect(() => {
    fetch(`/api/inventory?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        const next: Record<number, number> = {};
        data.forEach((line: { ingredient_id: number; quantity: number }) => {
          next[line.ingredient_id] = line.quantity;
        });
        setRows(next);
      });
  }, [date]);

  const save = async (ingredient_id: number) => {
    await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredient_id, quantity: rows[ingredient_id] ?? 0, date })
    });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">End-of-day Inventory</h2>
      <input type="date" className="w-full border bg-white p-3" value={date} onChange={(e) => setDate(e.target.value)} />
      <div className="space-y-2">
        {ingredients.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr,130px,80px] items-center gap-2 rounded-xl bg-white p-3 shadow">
            <span className="font-medium">{item.name}</span>
            <NumericKeypadInput
              value={rows[item.id] ?? 0}
              onChange={(val) => setRows((prev) => ({ ...prev, [item.id]: val }))}
            />
            <button className="bg-brand p-3 text-sm font-semibold text-white" onClick={() => save(item.id)}>
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
