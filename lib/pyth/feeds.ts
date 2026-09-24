// Pyth Hermes feed IDs for each xStock's real-world underlying equity/ETF — confirmed live via
// Hermes' /v2/price_feeds search endpoint on 2026-09-24. Only xStocks have a real-world equity
// counterpart; Tessera/PreStocks assets (private companies) have no Pyth feed.
//
// Scoped to what the project's Pyth Pro grant actually entitles (verified live against
// /v2/updates/price/latest on 2026-09-24): Equity.US.{VOO,TSLA,QQQ}/USD. NVDAx has no entry —
// Equity.US.NVDA/USD is not in the grant. SPYx is compared against VOO (Vanguard S&P 500 ETF)
// rather than SPY, since Equity.US.SPY/USD isn't in the grant either but VOO tracks the same
// S&P 500 index.
export interface PythEquityFeed {
  feedId: string;
  // Real-world ticker being compared against — not always the xStock's own ticker (see SPYx).
  label: string;
}

export const PYTH_EQUITY_FEED_BY_MINT: Readonly<Record<string, PythEquityFeed>> = {
  // SPYx -> Equity.US.VOO/USD (S&P 500 proxy — SPY itself isn't in the current grant)
  XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W: {
    feedId: "236b30dd09a9c00dfeec156c7b1efd646c0f01825a1758e3e4a0679e3bdff179",
    label: "VOO",
  },
  // QQQx -> Equity.US.QQQ/USD
  Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ: {
    feedId: "9695e2b96ea7b3859da9ed25b7a46a920a776e2fdae19a7bcfdf2b219230452d",
    label: "QQQ",
  },
  // TSLAx -> Equity.US.TSLA/USD
  XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB: {
    feedId: "16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1",
    label: "TSLA",
  },
};
