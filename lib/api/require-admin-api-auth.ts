import "server-only";

import { NextResponse } from "next/server";
import { getCurrentAdminUser, type AdminUser } from "@/lib/auth/guards";
import { can, type Permission } from "@/lib/auth/permissions";

type AuthSuccess = { user: AdminUser };

type AuthFailure = { response: NextResponse };

export async function requireAdminApiPermission(
  permission: Permission,
): Promise<AuthSuccess | AuthFailure> {
  const user = await getCurrentAdminUser();
  if (!user) {
    return {
      response: NextResponse.json(
        { success: false, message: "Требуется авторизация." },
        { status: 401 },
      ),
    };
  }

  if (!can(user.role, permission)) {
    return {
      response: NextResponse.json(
        { success: false, message: "Недостаточно прав." },
        { status: 403 },
      ),
    };
  }

  return { user };
}
