import type { UserRole } from "./roles";

export const SESSION_COOKIE = "roa_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = {
  userId: string;
  role: UserRole;
  exp: number;
};

function getDevSecret(): string {
  return "dev-insecure-auth-secret-change-me-32chars";
}

export function getAuthSecret(envSecret?: string): string {
  const secret = (envSecret ?? process.env.AUTH_SECRET ?? "").trim();
  if (secret.length >= 32) {
    return secret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be set in production.");
  }
  return getDevSecret();
}

function base64UrlToBytes(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function signPayload(encoded: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encoded),
  );
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(
  payload: SessionPayload,
  secret: string,
): Promise<string> {
  const encoded = bytesToBase64Url(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const signature = await signPayload(encoded, secret);
  return `${encoded}.${signature}`;
}

export async function parseSessionToken(
  token: string,
  secret: string,
): Promise<SessionPayload | null> {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expected = await signPayload(encoded, secret);
  if (!timingSafeEqual(signature, expected)) {
    return null;
  }

  try {
    const json = new TextDecoder().decode(base64UrlToBytes(encoded));
    const payload = JSON.parse(json) as SessionPayload;

    if (
      !payload.userId ||
      !payload.role ||
      typeof payload.exp !== "number" ||
      payload.exp < Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
