export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const USDC_DECIMALS = 6;

export interface XStockAsset {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  badgeColor: string; // solid Tailwind bg-* class — no gradients per design system; AssetBadge's fallback if logoUrl fails to load
  logoUrl: string; // confirmed live via Jupiter's Token API V2 (api.jup.ag/tokens/v2/search) on 2026-09-25
  provider: "xstock" | "tessera" | "prestocks";
  lendEligible: boolean; // whether Jupiter Lend lists this mint as collateral — /borrow only offers these
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
    logoUrl: "https://xstocks-metadata.backed.fi/logos/tokens/NVDAx.png",
    provider: "xstock",
    lendEligible: true,
  },
  {
    mint: "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W",
    symbol: "SPYx",
    name: "S&P 500 xStock",
    decimals: 8,
    badgeColor: "bg-blue-500",
    logoUrl: "https://xstocks-metadata.backed.fi/logos/tokens/SPYx.png",
    provider: "xstock",
    lendEligible: true,
  },
  {
    mint: "Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ",
    symbol: "QQQx",
    name: "Nasdaq xStock",
    decimals: 8,
    badgeColor: "bg-violet-500",
    logoUrl: "https://xstocks-metadata.backed.fi/logos/tokens/QQQx.png",
    provider: "xstock",
    lendEligible: true,
  },
  {
    mint: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
    symbol: "TSLAx",
    name: "Tesla xStock",
    decimals: 8,
    badgeColor: "bg-red-500",
    logoUrl: "https://xstocks-metadata.backed.fi/logos/tokens/TSLAx.png",
    provider: "xstock",
    lendEligible: true,
  },
  // Tessera T-Tokens — mints + decimals confirmed live via Jupiter's swap quote (/swap/v1/quote)
  // and price (/price/v3) APIs on 2026-09-24. Not Jupiter Lend collateral (confirmed against
  // /lend/v1/borrow/vaults) — swap/recurring-buy only, never shown on /borrow.
  {
    mint: "oPAiAikWTaFj9RYoRFD35ccfwhnMcB3ThgBZRHSkjTZ",
    symbol: "T-OpenAI",
    name: "OpenAI (Tessera)",
    decimals: 9,
    badgeColor: "bg-slate-700",
    logoUrl: "https://cdn.tesseralab.co/tessera/tokenicon_T-OpenAI.svg",
    provider: "tessera",
    lendEligible: false,
  },
  {
    mint: "TKLSidmLVt3cqGaaodG8tyRzoANfQwoh67AccjmubeZ",
    symbol: "T-Kalshi",
    name: "Kalshi (Tessera)",
    decimals: 9,
    badgeColor: "bg-amber-600",
    logoUrl: "https://cdn.tesseralab.co/tessera/tokenicon_T-Kalshi.svg",
    provider: "tessera",
    lendEligible: false,
  },
];

export const DEFAULT_ASSET: XStockAsset = SUPPORTED_ASSETS[0];

// PreStocks tokens — mints confirmed live via Jupiter's swap quote and price APIs on 2026-09-24.
// Deliberately kept OUT of SUPPORTED_ASSETS — the /setup plan-creation picker and /borrow (lend
// collateral) never offer these, since PreStocks' bounty rules disqualify a submission that also
// integrates non-PreStocks pre-IPO tokens (e.g. the Tessera assets above) in those product flows.
// They ARE included in /portfolio's Holdings table (see usePortfolioData.ts) — that's the user's
// own balance view, not a cross-provider integration surface, so it's outside the anti-mixing rule.
export const PRESTOCKS_ASSETS: readonly XStockAsset[] = [
  {
    mint: "Pren1FvFX6J3E4kXhJuCiAD5aDmGEb7qJRncwA8Lkhw",
    symbol: "Pre-ANTH",
    name: "Anthropic (PreStocks)",
    decimals: 9,
    badgeColor: "bg-orange-700",
    logoUrl: "https://www.prestocks.com/logos/anthropic.png?cachebust=1",
    provider: "prestocks",
    lendEligible: false,
  },
  {
    mint: "PresTj4Yc2bAR197Er7wz4UUKSfqt6FryBEdAriBoQB",
    symbol: "Pre-ADRL",
    name: "Anduril (PreStocks)",
    decimals: 9,
    badgeColor: "bg-stone-700",
    logoUrl: "https://www.prestocks.com/logos/anduril.png?cachebust=1",
    provider: "prestocks",
    lendEligible: false,
  },
];

export function findAssetByMint(mint: string): XStockAsset | undefined {
  return (
    SUPPORTED_ASSETS.find((asset) => asset.mint === mint) ??
    PRESTOCKS_ASSETS.find((asset) => asset.mint === mint)
  );
}

// Jupiter Lend's sentinel for "repay all debt" / "withdraw all collateral" in an /operate call.
export const LEND_MIN_I128 = "-170141183460469231731687303715884105728";
