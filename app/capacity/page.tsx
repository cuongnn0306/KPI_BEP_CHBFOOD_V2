"use client";

import { NumericKeypadInput } from "@/components/NumericKeypadInput";
import { useEffect, useState } from "react";

type Ingredient = { id: number; name: string; unit: string };

export default function CapacityPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [batchSize, setBatchSize] = useState<Record<number, number>>({});
  const [batchTime, setBatchTime] = useState<Record<number, number>>({});

  useEffect(() => {
    Promise.all([fetch("/api/ingredients").then((r) => r.json()), fetch("/api/capacity").then((r) => r.json())]).then(
      ([ing, cap]) => {
        setIngredients(ing);
        const sizes: Record<number, number> = {};
        const times: Record<number, number> = {};
        cap.forEach((row: { ingredient_id: number; batch_size: number; batch_time_minutes: number }) => {
          sizes[row.ingredient_id] = row.batch_size;
          times[row.ingredient_id] = row.batch_time_minutes;
        });
        setBatchSize(sizes);
        setBatchTime(times);
      }
    );
  }, []);

  const save = (ingredient_id: number) =>
    fetch("/api/capacity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredient_id,
        batch_size: batchSize[ingredient_id] ?? 0,
        batch_time_minutes: batchTime[ingredient_id] ?? 0
      })
    });

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Kitchen Capacity Settings</h2>
      {ingredients.map((item) => (
        <div key={item.id} className="rounded-xl bg-white p-3 shadow space-y-2">
          <p className="font-semibold">{item.name}</p>
          <div className="grid grid-cols-2 gap-2">
            <NumericKeypadInput value={batchSize[item.id] ?? 0} onChange={(val) => setBatchSize((p) => ({ ...p, [item.id]: val }))} placeholder="Batch size" />
            <NumericKeypadInput value={batchTime[item.id] ?? 0} onChange={(val) => setBatchTime((p) => ({ ...p, [item.id]: val }))} placeholder="Batch minutes" />
          </div>
          <button className="w-full bg-brand p-3 font-semibold text-white" onClick={() => save(item.id)}>
            Save
          </button>
        </div>
      ))}
    </div>
  );
}
