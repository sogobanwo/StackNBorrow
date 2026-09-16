import { jupiterFetch } from "@/lib/jupiter/server";
import type { LendOperateRequest, LendOperateResponse } from "@/lib/jupiter/types";

export async function POST(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market") ?? "main";
  const payload = (await request.json()) as LendOperateRequest;

  const res = await jupiterFetch(`/lend/v1/borrow/operate?market=${market}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as LendOperateResponse;
  return Response.json(data);
}
