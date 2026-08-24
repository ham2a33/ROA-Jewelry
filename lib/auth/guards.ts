import "server-only";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/config/site-config";
import { getSession, type SessionPayload } from "./session";
import { can, type Permission } from "./permissions";
import type { UserRole } from "./roles";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: { id: session.userId, isActive: true },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    return null;
  }

  return user;
}

export async function requireAuth(): Promise<AdminUser> {
  const user = await getCurrentAdminUser();
  if (!user) {
    redirect(siteConfig.routes.admin.login);
  }
  return user;
}

export async function requirePermission(
  permission: Permission,
): Promise<AdminUser> {
  const user = await requireAuth();
  if (!can(user.role, permission)) {
    redirect(siteConfig.routes.admin.dashboard);
  }
  return user;
}

export async function requireAdminRole(): Promise<AdminUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    redirect(siteConfig.routes.admin.dashboard);
  }
  return user;
}

export function assertPermission(user: AdminUser, permission: Permission): void {
  if (!can(user.role, permission)) {
    throw new Error("Forbidden");
  }
}

export async function getOptionalSession(): Promise<SessionPayload | null> {
  return getSession();
}
