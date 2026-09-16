import { jupiterFetch } from "@/lib/jupiter/server";
import type { PriceResponse } from "@/lib/jupiter/types";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return Response.json({ error: "Missing ids query param" }, { status: 400 });
  }

  const res = await jupiterFetch(`/price/v3?ids=${encodeURIComponent(ids)}`);

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as PriceResponse;
  return Response.json(data);
}
