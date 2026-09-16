import { jupiterFetch } from "@/lib/jupiter/server";
import type { AuthVerifyRequest, AuthVerifyResponse } from "@/lib/jupiter/types";

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as { walletPubkey: string; signature: string };

  const payload: AuthVerifyRequest = {
    type: "message",
    walletPubkey: body.walletPubkey,
    signature: body.signature,
  };

  const res = await jupiterFetch("/trigger/v2/auth/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as AuthVerifyResponse;
  return Response.json(data);
}
