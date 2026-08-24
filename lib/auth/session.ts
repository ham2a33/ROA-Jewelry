import "server-only";

import { cookies } from "next/headers";
import { env } from "@/lib/env";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getAuthSecret,
  parseSessionToken,
  type SessionPayload,
} from "./session-token";

export {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  type SessionPayload,
} from "./session-token";

function secret(): string {
  return getAuthSecret(env.AUTH_SECRET);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return parseSessionToken(token, secret());
}

export async function setSessionCookie(payload: Omit<SessionPayload, "exp">) {
  const cookieStore = await cookies();
  const exp = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const token = await createSessionToken({ ...payload, exp }, secret());

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
