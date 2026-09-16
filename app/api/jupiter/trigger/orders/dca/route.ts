import { jupiterFetch, readBearerToken } from "@/lib/jupiter/server";
import type { CreateDcaOrderRequest, CreateDcaOrderResponse } from "@/lib/jupiter/types";

export async function POST(request: Request): Promise<Response> {
  const bearerToken = readBearerToken(request);
  if (!bearerToken) {
    return Response.json({ error: "Missing Authorization bearer token" }, { status: 401 });
  }

  const payload = (await request.json()) as CreateDcaOrderRequest;

  const res = await jupiterFetch("/trigger/v2/orders/dca", {
    method: "POST",
    bearerToken,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as CreateDcaOrderResponse;
  return Response.json(data);
}
