import { VersionedTransaction } from "@solana/web3.js";
import { getReadonlyConnection } from "@/lib/solana/balances";
import { withTimeout } from "@/lib/timeout";

const SIMULATE_TIMEOUT_MS = 10000;

export interface SimulationResult {
  ok: boolean;
  error: string | null;
}

function formatSimulationError(err: unknown): string {
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Transaction simulation failed.";
  }
}

/** Dry-runs a base64 unsigned transaction against live mainnet state — no fee, no signature, no funds moved. */
export async function simulateTransactionBase64(base64Tx: string): Promise<SimulationResult> {
  const connection = getReadonlyConnection();
  if (!connection) {
    // RPC not configured — skip the safety check rather than block the flow
    return { ok: true, error: null };
  }
  try {
    const transaction = VersionedTransaction.deserialize(Buffer.from(base64Tx, "base64"));
    const { value } = await withTimeout(
      connection.simulateTransaction(transaction, { sigVerify: false, replaceRecentBlockhash: true }),
      SIMULATE_TIMEOUT_MS,
      "Simulation timed out — the RPC endpoint may be slow or unreachable."
    );
    if (value.err) {
      return { ok: false, error: formatSimulationError(value.err) };
    }
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Simulation failed." };
  }
}
