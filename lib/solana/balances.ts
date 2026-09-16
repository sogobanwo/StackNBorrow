import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { withTimeout } from "@/lib/timeout";

const RPC_TIMEOUT_MS = 8000;

/** Returns null when NEXT_PUBLIC_SOLANA_RPC_URL isn't configured yet — callers should skip balance checks, not throw. */
export function getReadonlyConnection(): Connection | null {
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  if (!rpcUrl) return null;
  return new Connection(rpcUrl, "confirmed");
}

export async function getSolBalance(connection: Connection, owner: string): Promise<number> {
  const lamports = await withTimeout(
    connection.getBalance(new PublicKey(owner)),
    RPC_TIMEOUT_MS,
    "RPC timed out fetching SOL balance."
  );
  return lamports / LAMPORTS_PER_SOL;
}

interface ParsedTokenAmount {
  uiAmount: number | null;
}

function readUiAmount(parsed: unknown): number {
  const amount = (parsed as { info?: { tokenAmount?: ParsedTokenAmount } })?.info?.tokenAmount?.uiAmount;
  return typeof amount === "number" ? amount : 0;
}

export async function getSplTokenBalance(
  connection: Connection,
  owner: string,
  mint: string
): Promise<number> {
  const accounts = await withTimeout(
    connection.getParsedTokenAccountsByOwner(new PublicKey(owner), { mint: new PublicKey(mint) }),
    RPC_TIMEOUT_MS,
    "RPC timed out fetching token balance."
  );
  const first = accounts.value[0];
  return first ? readUiAmount(first.account.data.parsed) : 0;
}
