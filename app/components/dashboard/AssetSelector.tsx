"use client";

import { SUPPORTED_ASSETS, type XStockAsset } from "@/lib/jupiter/assets";
import AssetBadge from "@/app/components/dashboard/AssetBadge";
import { useAssetPrices } from "@/lib/jupiter/useAssetPrices";

export default function AssetSelector({
  selected,
  onSelect,
  disabled,
  assets = SUPPORTED_ASSETS,
}: {
  selected: XStockAsset;
  onSelect: (asset: XStockAsset) => void;
  disabled?: boolean;
  assets?: readonly XStockAsset[];
}) {
  const { prices, loading } = useAssetPrices(assets);

  return (
    <div className="flex flex-wrap gap-2">
      {assets.map((asset) => {
        const active = asset.mint === selected.mint;
        const price = prices[asset.mint];
        return (
          <button
            key={asset.mint}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(asset)}
            className={
              active
                ? "flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-left text-sm font-medium text-white disabled:opacity-60"
                : "flex items-center gap-2 rounded-xl bg-subtle px-3 py-2 text-left text-sm font-medium text-muted transition-colors hover:bg-border disabled:opacity-60"
            }
          >
            <AssetBadge asset={asset} className="h-6 w-6 text-[9px]" />
            <span>
              <span className="block">{asset.symbol}</span>
              <span className={active ? "block text-xs text-white/80" : "block text-xs text-faint"}>
                {loading ? "…" : price !== undefined ? `$${price.toFixed(2)}` : "—"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
