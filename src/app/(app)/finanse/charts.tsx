"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function FinanceCharts({
  hoursByMonth,
  incomeByMonth,
}: {
  hoursByMonth: { month: string; godziny: number }[];
  incomeByMonth: { month: string; dochod: number }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-surface p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-medium text-slate-700">Dynamika dochodu</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={incomeByMonth}>
            <CartesianGrid vertical={false} stroke="var(--color-slate-200)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-slate-500)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--color-slate-500)" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(
                  Number(value)
                )
              }
              contentStyle={{
                borderRadius: 8,
                borderColor: "var(--color-slate-200)",
                background: "var(--color-surface)",
                color: "var(--foreground)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="dochod" name="Dochód" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 bg-surface p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-medium text-slate-700">Godziny lekcji miesięcznie</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={hoursByMonth}>
            <CartesianGrid vertical={false} stroke="var(--color-slate-200)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-slate-500)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--color-slate-500)" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip
              formatter={(value) => `${value} h`}
              contentStyle={{
                borderRadius: 8,
                borderColor: "var(--color-slate-200)",
                background: "var(--color-surface)",
                color: "var(--foreground)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="godziny" name="Godziny" fill="var(--color-accent)" fillOpacity={0.55} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
