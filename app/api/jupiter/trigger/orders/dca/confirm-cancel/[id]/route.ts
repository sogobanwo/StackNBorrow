import { jupiterFetch, readBearerToken } from "@/lib/jupiter/server";
import type { CancelDcaConfirmRequest, CancelDcaConfirmResponse } from "@/lib/jupiter/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const bearerToken = readBearerToken(request);
  if (!bearerToken) {
    return Response.json({ error: "Missing Authorization bearer token" }, { status: 401 });
  }

  const { id } = await params;
  const payload = (await request.json()) as CancelDcaConfirmRequest;

  const res = await jupiterFetch(`/trigger/v2/orders/dca/confirm-cancel/${id}`, {
    method: "POST",
    bearerToken,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as CancelDcaConfirmResponse;
  return Response.json(data);
}
