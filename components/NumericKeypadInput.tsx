"use client";

import { useState } from "react";

type Props = {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
};

export function NumericKeypadInput({ value, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value ? String(value) : "");

  const apply = () => {
    onChange(Number(draft || 0));
    setOpen(false);
  };

  const tap = (char: string) => setDraft((prev) => `${prev}${char}`);

  return (
    <>
      <button className="w-full border bg-white p-3 text-left text-lg" onClick={() => setOpen(true)}>
        {value || draft ? value || draft : placeholder || "0"}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4">
          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-white p-4">
            <p className="mb-2 text-center text-2xl font-bold">{draft || "0"}</p>
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((n) => (
                <button key={n} className="bg-slate-100 p-4 text-2xl font-bold" onClick={() => tap(n)}>
                  {n}
                </button>
              ))}
              <button className="bg-amber-100 p-4 text-xl font-bold" onClick={() => setDraft((d) => d.slice(0, -1))}>
                ⌫
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="bg-slate-200 p-3 font-semibold" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="bg-brand p-3 font-semibold text-white" onClick={apply}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
