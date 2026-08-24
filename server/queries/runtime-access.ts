import "server-only";

import { connection } from "next/server";

/**
 * Ensures the current render runs at request time, not during `next build`
 * prerendering. Call before any Prisma/database access in server queries.
 */
export async function requireRuntimeAccess(): Promise<void> {
  await connection();
}
