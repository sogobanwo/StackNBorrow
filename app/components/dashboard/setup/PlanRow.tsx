"use client";

import { formatRelativeFuture, formatTokenAmount, symbolForMint } from "@/lib/jupiter/format";
import type { DcaOrderHistoryItem } from "@/lib/jupiter/types";

export default function PlanRow({
  plan,
  onCancel,
  cancelling,
}: {
  plan: DcaOrderHistoryItem;
  onCancel: (plan: DcaOrderHistoryItem) => void;
  cancelling: boolean;
}) {
  const isActive = plan.state === "active";

  return (
    <tr className="border-t border-border">
      <td className="whitespace-nowrap py-3.5 pr-2 font-medium text-heading">
        {symbolForMint(plan.outputMint)}
      </td>
      <td className="whitespace-nowrap pr-2 text-muted">${formatTokenAmount(plan.amountPerRound)} USDC</td>
      <td className="whitespace-nowrap pr-2 text-muted">
        {plan.roundsFilled}/{plan.numberOfRounds} rounds
      </td>
      <td className="whitespace-nowrap pr-2 text-muted">{formatRelativeFuture(plan.nextFillAt)}</td>
      <td className="pr-2">
        <span
          className={
            isActive
              ? "whitespace-nowrap rounded-full bg-success-bg px-2.5 py-1 text-xs font-medium text-success-text"
              : "whitespace-nowrap rounded-full bg-subtle px-2.5 py-1 text-xs font-medium text-muted"
          }
        >
          {plan.displayState}
        </span>
      </td>
      <td>
        {isActive && (
          <button
            type="button"
            disabled={cancelling}
            onClick={() => onCancel(plan)}
            className="whitespace-nowrap rounded-lg bg-subtle px-3 py-1.5 text-xs font-medium text-muted disabled:opacity-60"
          >
            {cancelling ? "Cancelling…" : "Cancel"}
          </button>
        )}
      </td>
    </tr>
  );
}
