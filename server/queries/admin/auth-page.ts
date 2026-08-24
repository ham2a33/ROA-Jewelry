import "server-only";

import { prisma } from "@/lib/db";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

export async function getAdminLoginBootstrapState(): Promise<{
  showBootstrap: boolean;
}> {
  await requireRuntimeAccess();

  const userCount = await prisma.user.count().catch(() => 0);

  return {
    showBootstrap: userCount === 0,
  };
}
