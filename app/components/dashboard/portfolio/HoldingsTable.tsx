"use client";

import AssetBadge from "@/app/components/dashboard/AssetBadge";
import type { AssetHolding } from "@/lib/jupiter/usePortfolioData";

export default function HoldingsTable({ holdings }: { holdings: AssetHolding[] }) {
  const held = holdings.filter((h) => h.balance > 0);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
      <h4 className="text-sm font-semibold text-heading">Your Holdings</h4>
      {held.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          No holdings yet — create a recurring plan or buy now to start accumulating.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-120 text-left text-sm">
            <thead>
              <tr className="text-xs text-faint">
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Balance</th>
                <th className="pb-3 font-medium">USD Value</th>
              </tr>
            </thead>
            <tbody>
              {held.map(({ asset, balance, priceUsd }) => (
                <tr key={asset.mint} className="border-t border-border">
                  <td className="flex items-center gap-2.5 py-3.5">
                    <AssetBadge asset={asset} className="h-6 w-6 text-[10px]" />
                    <span>
                      <span className="block font-medium text-heading">{asset.symbol}</span>
                      <span className="block text-xs text-faint">{asset.name}</span>
                    </span>
                  </td>
                  <td className="text-muted">
                    {balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {asset.symbol}
                  </td>
                  <td className="text-muted">
                    {priceUsd !== null
                      ? `$${(balance * priceUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
