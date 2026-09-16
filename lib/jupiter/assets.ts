export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const USDC_DECIMALS = 6;

export interface XStockAsset {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  badgeColor: string; // solid Tailwind bg-* class — no gradients per design system
}

// Mints and decimals confirmed live via Jupiter's token search API on 2026-09-16.
// Limited to the 4 xStocks currently listed as Jupiter Lend collateral (also confirmed live) —
// /borrow only works for these; /setup's recurring-buy would work with any xStock Jupiter routes.
export const SUPPORTED_ASSETS: readonly XStockAsset[] = [
  {
    mint: "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
    symbol: "NVDAx",
    name: "NVIDIA xStock",
    decimals: 8,
    badgeColor: "bg-emerald-500",
  },
  {
    mint: "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W",
    symbol: "SPYx",
    name: "S&P 500 xStock",
    decimals: 8,
    badgeColor: "bg-blue-500",
  },
  {
    mint: "Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ",
    symbol: "QQQx",
    name: "Nasdaq xStock",
    decimals: 8,
    badgeColor: "bg-violet-500",
  },
  {
    mint: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
    symbol: "TSLAx",
    name: "Tesla xStock",
    decimals: 8,
    badgeColor: "bg-red-500",
  },
];

export const DEFAULT_ASSET: XStockAsset = SUPPORTED_ASSETS[0];

export function findAssetByMint(mint: string): XStockAsset | undefined {
  return SUPPORTED_ASSETS.find((asset) => asset.mint === mint);
}

// Jupiter Lend's sentinel for "repay all debt" / "withdraw all collateral" in an /operate call.
export const LEND_MIN_I128 = "-170141183460469231731687303715884105728";
