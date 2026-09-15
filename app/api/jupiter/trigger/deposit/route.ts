import { jupiterFetch, readBearerToken } from "@/lib/jupiter/server";
import type { DepositCraftRequest, DepositCraftResponse } from "@/lib/jupiter/types";

export async function POST(request: Request): Promise<Response> {
  const bearerToken = readBearerToken(request);
  if (!bearerToken) {
    return Response.json({ error: "Missing Authorization bearer token" }, { status: 401 });
  }

  const body = (await request.json()) as Omit<DepositCraftRequest, "orderType">;
  const payload: DepositCraftRequest = { ...body, orderType: "dca" };

  const res = await jupiterFetch("/trigger/v2/deposit/craft", {
    method: "POST",
    bearerToken,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as DepositCraftResponse;
  return Response.json(data);
}
