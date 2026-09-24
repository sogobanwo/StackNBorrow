import { hermesFetch } from "@/lib/pyth/server";
import type { HermesLatestPriceResponse, PythPriceResponse } from "@/lib/pyth/types";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return Response.json({ error: "Missing ids query param" }, { status: 400 });
  }

  const idList = ids.split(",").filter(Boolean);
  const query = idList.map((id) => `ids[]=${encodeURIComponent(id)}`).join("&");
  const res = await hermesFetch(`/v2/updates/price/latest?${query}&parsed=true`);

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as HermesLatestPriceResponse;

  const result: PythPriceResponse = {};
  for (const item of data.parsed ?? []) {
    result[item.id] = {
      usdPrice: Number(item.price.price) * 10 ** item.price.expo,
      confidence: Number(item.price.conf) * 10 ** item.price.expo,
      publishTime: item.price.publish_time,
    };
  }
  return Response.json(result);
}
