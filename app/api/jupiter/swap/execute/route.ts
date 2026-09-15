import { jupiterFetch } from "@/lib/jupiter/server";
import type { SwapExecuteRequest, SwapExecuteResponse } from "@/lib/jupiter/types";

export async function POST(request: Request): Promise<Response> {
  const payload = (await request.json()) as SwapExecuteRequest;

  const res = await jupiterFetch("/swap/v2/execute", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as SwapExecuteResponse;
  return Response.json(data);
}
