"use client";

import { useCountUp } from "@/lib/motion/useCountUp";

/** Shared stat-tile used by /portfolio and /borrow — hosts the count-up animation as data loads. */
export default function StatTile({
  label,
  value,
  formatter = (v) => v.toFixed(2),
}: {
  label: string;
  value: number | null;
  formatter?: (value: number) => string;
}) {
  const display = useCountUp(value, formatter);

  return (
    <div className="rounded-2xl border border-border/60 bg-card px-4 py-4 shadow-sm shadow-slate-900/2">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-heading">{display}</p>
    </div>
  );
}
