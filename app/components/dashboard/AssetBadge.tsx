"use client";

import { useState } from "react";
import type { XStockAsset } from "@/lib/jupiter/assets";

export default function AssetBadge({
  asset,
  className,
}: {
  asset: XStockAsset;
  className?: string;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const sizeClassName = className ?? "h-6 w-6 text-[10px]";

  if (!logoFailed) {
    return (
      <img
        src={asset.logoUrl}
        alt={asset.symbol}
        onError={() => setLogoFailed(true)}
        className={`shrink-0 rounded-full bg-white object-cover ${sizeClassName}`}
      />
    );
  }

  // "NVDAx" -> "NV", "T-OpenAI" -> "OP" (initials from the part after a provider prefix, if any).
  const initials = asset.symbol
    .replace(/x$/, "")
    .split("-")
    .pop()!
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${asset.badgeColor} ${sizeClassName}`}
    >
      {initials}
    </span>
  );
}
