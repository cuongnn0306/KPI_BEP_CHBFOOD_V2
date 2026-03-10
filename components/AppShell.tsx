"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

const links = [
  ["/", "Dashboard"],
  ["/inventory", "Inventory"],
  ["/forecast", "Forecast"],
  ["/recipes", "Recipes"],
  ["/capacity", "Capacity"],
  ["/kpi", "KPI"]
];

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl p-4 pb-24">
      <header className="mb-4 rounded-2xl bg-brand p-4 text-white shadow">
        <h1 className="text-2xl font-bold">Kitchen Prep Planner</h1>
        <p className="text-sm opacity-90">Morning Shift KPI for Restaurant Operations</p>
      </header>

      <main>{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white p-2 shadow-inner">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2 md:grid-cols-6">
          {links.map(([href, label]) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 text-center text-sm font-semibold ${
                  active ? "bg-brand text-white" : "bg-slate-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
