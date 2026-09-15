import { jupiterFetch } from "@/lib/jupiter/server";
import type { SwapOrderResponse } from "@/lib/jupiter/types";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const inputMint = searchParams.get("inputMint");
  const outputMint = searchParams.get("outputMint");
  const amount = searchParams.get("amount");
  const taker = searchParams.get("taker");
  const slippageBps = searchParams.get("slippageBps");

  if (!inputMint || !outputMint || !amount || !taker) {
    return Response.json(
      { error: "Missing required query params: inputMint, outputMint, amount, taker" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({ inputMint, outputMint, amount, taker });
  if (slippageBps) params.set("slippageBps", slippageBps);

  const res = await jupiterFetch(`/swap/v2/order?${params.toString()}`);

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as SwapOrderResponse;
  return Response.json(data);
}
