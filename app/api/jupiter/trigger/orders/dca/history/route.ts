import { jupiterFetch, readBearerToken } from "@/lib/jupiter/server";
import type { DcaOrderHistoryResponse } from "@/lib/jupiter/types";

const PASSTHROUGH_PARAMS = ["state", "mint", "limit", "offset", "sort", "dir"];

export async function GET(request: Request): Promise<Response> {
  const bearerToken = readBearerToken(request);
  if (!bearerToken) {
    return Response.json({ error: "Missing Authorization bearer token" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const forwarded = new URLSearchParams();
  for (const key of PASSTHROUGH_PARAMS) {
    const value = searchParams.get(key);
    if (value) forwarded.set(key, value);
  }

  const query = forwarded.toString();
  const res = await jupiterFetch(`/trigger/v2/orders/history/dca${query ? `?${query}` : ""}`, {
    bearerToken,
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as DcaOrderHistoryResponse;
  return Response.json(data);
}
