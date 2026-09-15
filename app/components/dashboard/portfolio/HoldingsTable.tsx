"use client";

import Image from "next/image";
import nvdaxLogo from "@/public/illustrations/nvdax-logo.png";
import { NVDAX_NAME, NVDAX_SYMBOL } from "@/lib/jupiter/assets";

export default function HoldingsTable({
  nvdaxBalance,
  nvdaxPriceUsd,
}: {
  nvdaxBalance: number | null;
  nvdaxPriceUsd: number | null;
}) {
  const hasBalance = nvdaxBalance !== null && nvdaxBalance > 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
      <h4 className="text-sm font-semibold text-heading">Your Holdings</h4>
      {!hasBalance ? (
        <p className="mt-4 text-sm text-muted">
          No {NVDAX_SYMBOL} yet — create a recurring plan to start accumulating.
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
              <tr className="border-t border-border">
                <td className="flex items-center gap-2.5 py-3.5">
                  <Image src={nvdaxLogo} alt="" width={24} height={25} className="h-6.25 w-6" />
                  <span>
                    <span className="block font-medium text-heading">{NVDAX_SYMBOL}</span>
                    <span className="block text-xs text-faint">{NVDAX_NAME}</span>
                  </span>
                </td>
                <td className="text-muted">
                  {nvdaxBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {NVDAX_SYMBOL}
                </td>
                <td className="text-muted">
                  {nvdaxPriceUsd !== null
                    ? `$${(nvdaxBalance * nvdaxPriceUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                    : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
