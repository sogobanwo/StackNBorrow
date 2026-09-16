import { jupiterFetch, readBearerToken } from "@/lib/jupiter/server";

export async function GET(request: Request): Promise<Response> {
  const bearerToken = readBearerToken(request);
  if (!bearerToken) {
    return Response.json({ error: "Missing Authorization bearer token" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const register = searchParams.get("register") === "true";
  const path = register ? "/trigger/v2/vault/register" : "/trigger/v2/vault";

  const res = await jupiterFetch(path, { bearerToken });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  return Response.json(await res.json());
}
