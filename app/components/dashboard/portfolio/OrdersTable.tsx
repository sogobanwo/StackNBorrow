"use client";

import { formatRelativeFuture, formatTokenAmount, symbolForMint } from "@/lib/jupiter/format";
import type { DcaOrderHistoryItem } from "@/lib/jupiter/types";

export default function OrdersTable({
  title,
  orders,
  showNextBuy,
}: {
  title: string;
  orders: DcaOrderHistoryItem[];
  showNextBuy: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
      <h4 className="text-sm font-semibold text-heading">{title}</h4>
      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Nothing here yet.</p>
      ) : (
        <div className="mt-4 min-w-0 overflow-x-auto">
          <table className="w-full min-w-105 text-left text-sm">
            <thead>
              <tr className="text-xs text-faint">
                <th className="pb-3 pr-2 font-medium">Ticker</th>
                <th className="pb-3 pr-2 font-medium">Amount</th>
                <th className="pb-3 pr-2 font-medium">Progress</th>
                {showNextBuy && <th className="pb-3 pr-2 font-medium">Next Buy</th>}
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="whitespace-nowrap py-3.5 pr-2 font-medium text-heading">
                    {symbolForMint(order.outputMint)}
                  </td>
                  <td className="whitespace-nowrap pr-2 text-muted">
                    ${formatTokenAmount(order.amountPerRound)} USDC
                  </td>
                  <td className="whitespace-nowrap pr-2 text-muted">
                    {order.roundsFilled}/{order.numberOfRounds} rounds
                  </td>
                  {showNextBuy && (
                    <td className="whitespace-nowrap pr-2 text-muted">
                      {formatRelativeFuture(order.nextFillAt)}
                    </td>
                  )}
                  <td className="whitespace-nowrap font-medium text-muted">{order.displayState}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
