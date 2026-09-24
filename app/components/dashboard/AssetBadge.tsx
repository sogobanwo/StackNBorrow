"use client";

import type { XStockAsset } from "@/lib/jupiter/assets";

export default function AssetBadge({
  asset,
  className,
}: {
  asset: XStockAsset;
  className?: string;
}) {
  // "NVDAx" -> "NV", "T-OpenAI" -> "OP" (initials from the part after a provider prefix, if any).
  const initials = asset.symbol
    .replace(/x$/, "")
    .split("-")
    .pop()!
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${asset.badgeColor} ${className ?? "h-6 w-6 text-[10px]"}`}
    >
      {initials}
    </span>
  );
}
