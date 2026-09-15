import { NVDAX_MINT, NVDAX_SYMBOL, USDC_DECIMALS } from "@/lib/jupiter/assets";

/** History amounts come back in smallest units, same convention as deposit/craft — divide by 10^decimals to display. */
export function formatTokenAmount(rawSmallestUnits: string, decimals: number = USDC_DECIMALS): string {
  const value = Number(rawSmallestUnits) / 10 ** decimals;
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function symbolForTriggerMint(mint: string): string {
  return mint === NVDAX_MINT ? NVDAX_SYMBOL : `${mint.slice(0, 4)}…${mint.slice(-4)}`;
}

export function formatRelativeFuture(iso: string | null): string {
  if (!iso) return "—";
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "—";
  const diffMs = target - Date.now();
  if (diffMs <= 0) return "Any moment";
  const days = Math.round(diffMs / (24 * 60 * 60 * 1000));
  if (days < 1) return "Today";
  if (days === 1) return "In 1 day";
  return `In ${days} days`;
}
