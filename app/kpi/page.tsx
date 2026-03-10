"use client";

import { useEffect, useState } from "react";

type Task = {
  ingredientId: number;
  ingredientName: string;
  prepareAmount: number;
  unit: string;
  batches: number;
  prepMinutes: number;
};

type Result = { tasks: Task[]; totalMinutes: number; startTime: string; finishTime: string };

export default function KPIPage() {
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("06:00");
  const [result, setResult] = useState<Result>({ tasks: [], totalMinutes: 0, startTime: "06:00", finishTime: "06:00" });

  useEffect(() => {
    fetch(`/api/kpi?date=${date}&startTime=${startTime}`).then((r) => r.json()).then(setResult);
  }, [date, startTime]);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Kitchen KPI Output</h2>
      <div className="grid grid-cols-2 gap-2">
        <input type="date" className="border bg-white p-3" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" className="border bg-white p-3" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>

      <div className="space-y-2">
        {result.tasks.map((task) => (
          <div key={task.ingredientId} className="rounded-xl bg-white p-3 shadow">
            <p className="text-lg font-bold">{task.ingredientName}</p>
            <p>Prepare: {task.prepareAmount} {task.unit}</p>
            <p>Batches: {task.batches}</p>
            <p>Time: {task.prepMinutes} minutes</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-brand p-4 text-white">
        <p className="text-lg font-bold">Total Preparation: {result.totalMinutes} minutes</p>
        <p>Kitchen Start: {result.startTime}</p>
        <p>Must Finish Before: {result.finishTime}</p>
      </div>
    </div>
  );
}
