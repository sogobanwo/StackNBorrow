import { jupiterFetch } from "@/lib/jupiter/server";
import type { LendPosition } from "@/lib/jupiter/types";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const users = searchParams.get("users");
  const market = searchParams.get("market") ?? "main";

  if (!users) {
    return Response.json({ error: "Missing users query param" }, { status: 400 });
  }

  const res = await jupiterFetch(
    `/lend/v1/borrow/positions?users=${encodeURIComponent(users)}&market=${market}`
  );

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as LendPosition[];
  return Response.json(data);
}
