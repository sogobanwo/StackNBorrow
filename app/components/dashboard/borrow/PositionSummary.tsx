"use client";

export default function PositionSummary({
  collateralValueUsd,
  debtValueUsd,
  currentLtv,
  liquidationLtv,
}: {
  collateralValueUsd: number;
  debtValueUsd: number;
  currentLtv: number;
  liquidationLtv: number;
}) {
  const hasDebt = debtValueUsd > 0;
  const riskRatio = liquidationLtv > 0 ? currentLtv / liquidationLtv : 0;
  const riskLevel = riskRatio < 0.6 ? "safe" : riskRatio < 0.85 ? "caution" : "danger";
  const riskLabel = riskLevel === "safe" ? "Healthy" : riskLevel === "caution" ? "Watch closely" : "At risk";
  const riskClass =
    riskLevel === "safe"
      ? "bg-success-bg text-success-text"
      : riskLevel === "caution"
        ? "bg-warning-bg text-warning-text"
        : "bg-error-bg text-error-text";

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
      <h4 className="text-sm font-semibold text-heading">Position Summary</h4>

      {!hasDebt ? (
        <div className="mt-10 flex flex-col items-center justify-center py-10 text-center">
          <p className="text-sm font-medium text-heading">No active borrows</p>
          <p className="mt-1 max-w-56 text-xs text-faint">
            Borrow against your collateral to see your position here.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3 text-sm">
          <Row label="Collateral value" value={`$${collateralValueUsd.toFixed(2)}`} />
          <Row label="Borrowed" value={`$${debtValueUsd.toFixed(2)}`} />
          <Row label="Current LTV" value={`${(currentLtv * 100).toFixed(1)}%`} />
          <Row label="Liquidation LTV" value={`${(liquidationLtv * 100).toFixed(1)}%`} />
          <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${riskClass}`}>
            {riskLabel}
          </span>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-faint">{label}</span>
      <span className="font-medium text-heading">{value}</span>
    </div>
  );
}
