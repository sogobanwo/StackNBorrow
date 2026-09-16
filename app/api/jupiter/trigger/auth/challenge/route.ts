import { jupiterFetch } from "@/lib/jupiter/server";
import type { AuthChallengeRequest, AuthChallengeResponse } from "@/lib/jupiter/types";

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as { walletPubkey: string };

  const payload: AuthChallengeRequest = {
    walletPubkey: body.walletPubkey,
    type: "message",
  };

  const res = await jupiterFetch("/trigger/v2/auth/challenge", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as AuthChallengeResponse;
  return Response.json(data);
}
