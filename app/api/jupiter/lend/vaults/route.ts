import { jupiterFetch } from "@/lib/jupiter/server";
import type { LendBorrowVault } from "@/lib/jupiter/types";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market") ?? "main";

  const res = await jupiterFetch(`/lend/v1/borrow/vaults?market=${market}`);

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  const data = (await res.json()) as LendBorrowVault[];
  return Response.json(data);
}
