export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return false;
  }

  try {
    // Behind Dokploy/Traefik, Next.js may see the upstream http:// container
    // URL even though the browser sent the request to the public HTTPS origin.
    // Use proxy-forwarded public authority when present; otherwise compare the
    // request URL as before. Traefik supplies these headers for routed traffic.
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost?.split(",")[0]?.trim() || request.headers.get("host");
    const forwardedProto = request.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const requestUrl = new URL(request.url);
    const expectedOrigin = host
      ? `${forwardedProto || requestUrl.protocol.slice(0, -1)}://${host}`
      : requestUrl.origin;

    return new URL(origin).origin === new URL(expectedOrigin).origin;
  } catch {
    return false;
  }
}
