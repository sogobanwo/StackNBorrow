// Shapes verified against live developers.jup.ag docs on 2026-09-15 — Jupiter's
// "Recurring API" has been superseded by "Trigger V2" (vault-based deposits).

export interface AuthChallengeRequest {
  walletPubkey: string;
  type: "message";
}

export interface AuthChallengeResponse {
  type: "message";
  challenge: string;
}

export interface AuthVerifyRequest {
  type: "message";
  walletPubkey: string;
  signature: string; // base58-encoded signature over the challenge string — confirmed live 2026-09-16
}

export interface AuthVerifyResponse {
  token: string; // JWT, valid 24h
  authMode?: string;
}

export interface DepositCraftRequest {
  inputMint: string;
  outputMint: string;
  userAddress: string;
  amount: string; // smallest units, as a string
  orderType: "dca";
}

export interface DepositCraftResponse {
  transaction: string; // base64 unsigned transaction
  requestId: string;
  receiverAddress: string;
  mint: string;
  amount: string;
  tokenDecimals: number;
  inputTokenAccount: string;
}

export interface CreateDcaOrderRequest {
  depositRequestId: string; // from deposit/craft
  depositSignedTx: string; // base64 signed (not yet broadcast) deposit transaction
  userPubkey: string; // must match the JWT
  inputMint: string;
  outputMint: string; // the asset being accumulated
  inputAmount: string; // total amount to DCA, smallest units — dust from uneven division goes to the last round
  orderCount: number; // min 2
  intervalSeconds: number; // 60s - 1yr
  minPriceUsd?: number;
  maxPriceUsd?: number;
  beginFillAt?: string; // ISO timestamp, max 30 days out
}

export interface CreateDcaOrderResponse {
  id: string;
  txSignature: string;
}

export type DcaOrderState = "active" | "past";

export interface DcaOrderHistoryQuery {
  state?: DcaOrderState;
  mint?: string;
  limit?: number;
  offset?: number;
  sort?: "updated_at" | "created_at" | "next_fill_at";
  dir?: "asc" | "desc";
}

export interface DcaOrderHistoryItem {
  id: string;
  // The asset being accumulated. NOT `triggerMint` — that field is for price-conditional
  // limit/trigger orders and is always null on DCA orders, confirmed live against
  // developers.jup.ag's Trigger API docs on 2026-09-25.
  outputMint: string;
  inputAmountInitial: string;
  inputAmountRemaining: string;
  amountPerRound: string;
  outputAmountTotal: string;
  inputAmountUsed: string;
  numberOfRounds: number;
  roundsFilled: number;
  fillPercent: number;
  nextFillAt: string | null;
  lastFillAt: string | null;
  state: DcaOrderState;
  displayState: string;
  createdAt: string;
}

export interface DcaOrderHistoryResponse {
  orders: DcaOrderHistoryItem[];
  hasMore: boolean;
}

export interface CancelDcaInitiateResponse {
  transaction: string; // base64 unsigned withdrawal transaction to sign
  refundAmount: string;
  roundsRemaining: number;
}

export interface CancelDcaConfirmRequest {
  signedTransaction: string; // base64
}

export interface CancelDcaConfirmResponse {
  status: string;
}

export interface SwapOrderRequest {
  inputMint: string;
  outputMint: string;
  amount: string;
  taker: string;
  slippageBps?: number;
}

export interface SwapOrderResponse {
  transaction: string | null; // base64, null/"" if no route
  requestId: string;
  outAmount: string;
  router: string; // "metis" | "jupiterz" | "dflow" | "okx"
  mode?: string; // "ultra" | "manual"
  feeBps?: number;
  feeMint?: string;
  errorCode?: number;
  errorMessage?: string;
}

export interface SwapExecuteRequest {
  signedTransaction: string; // base64
  requestId: string;
  lastValidBlockHeight?: number;
}

export interface SwapExecuteResponse {
  status: "Success" | "Failed";
  signature: string;
  code: number;
  totalInputAmount: string;
  totalOutputAmount: string;
  error?: string;
}

export type LendMarket = "main" | "ethena";

export interface LendVaultToken {
  address: string; // mint
  name: string;
  symbol: string;
  uiSymbol: string;
  decimals: number;
  logoUrl: string;
  price: string; // USD, as a string
}

export interface LendBorrowVault {
  id: number; // vaultId, used in /operate
  address: string; // vault account address
  supplyToken: LendVaultToken; // collateral
  borrowToken: LendVaultToken; // debt asset
  collateralFactor: string; // basis points as a string, e.g. "800" = 80% max LTV — confirmed live 2026-09-16
  liquidationThreshold: string; // basis points as a string
  borrowable: string; // available liquidity, base units
  withdrawable: string; // base units
  minimumBorrowing: string; // base units
}

export interface LendPosition {
  id: number; // position NFT id
  vaultId: number;
  supply: string; // collateral amount, base units
  borrow: string; // current debt, base units
  dustBorrow: string; // debt including accrued interest, base units
}

export interface LendOperateRequest {
  vaultId: number;
  positionId: number; // 0 to create a new position
  positionOwner?: string;
  signer: string;
  colAmount: string; // signed base-units string: positive = supply, negative = withdraw, MIN_I128 = withdraw all
  debtAmount: string; // signed base-units string: positive = borrow, negative = repay, MIN_I128 = repay all
}

export interface LendOperateResponse {
  nftId: number;
  transaction: string; // base64 unsigned transaction
}

export interface PriceResponse {
  [mintAddress: string]: {
    usdPrice: number;
    blockId: number;
    decimals: number;
    priceChange24h: number;
    // Present for tokenized-equity mints (e.g. Tessera T-Tokens) — Jupiter's own view of the
    // underlying instrument, confirmed live via /price/v3 on 2026-09-24.
    stockData?: {
      id: string;
      price: number;
      mcap: number;
      updatedAt: string;
    };
  };
}
