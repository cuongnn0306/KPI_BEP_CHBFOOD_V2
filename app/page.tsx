import Link from "next/link";

const cards = [
  ["Inventory Input", "/inventory", "Capture end-of-day stock in under 2 minutes."],
  ["Forecast", "/forecast", "Enter expected dish sales for tomorrow."],
  ["Recipe Builder", "/recipes", "Maintain dish ingredient requirements."],
  ["Kitchen Capacity", "/capacity", "Configure batch size and batch time."],
  ["KPI Results", "/kpi", "Auto-generate prep tasks and shift finish time."]
];

export default function DashboardPage() {
  return (
    <div className="space-y-3">
      {cards.map(([title, href, desc]) => (
        <Link key={href} href={href} className="block rounded-2xl bg-white p-4 shadow">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-slate-600">{desc}</p>
        </Link>
      ))}
    </div>
  );
}
