import { jupiterFetch, readBearerToken } from "@/lib/jupiter/server";
import type { CancelDcaInitiateResponse } from "@/lib/jupiter/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const bearerToken = readBearerToken(request);
  if (!bearerToken) {
    return Response.json({ error: "Missing Authorization bearer token" }, { status: 401 });
  }

  const { id } = await params;
  const res = await jupiterFetch(`/trigger/v2/orders/dca/cancel/${id}`, {
    method: "POST",
    bearerToken,
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as CancelDcaInitiateResponse;
  return Response.json(data);
}
