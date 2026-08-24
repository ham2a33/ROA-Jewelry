import type { UserRole } from "./roles";

export const PERMISSIONS = [
  "products.manage",
  "categories.manage",
  "orders.manage",
  "reviews.manage",
  "customers.manage",
  "media.manage",
  "homepage.manage",
  "banners.manage",
  "settings.manage",
  "admins.manage",
  "seo.manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ALL_PERMISSIONS: readonly Permission[] = PERMISSIONS;

const MANAGER_PERMISSIONS: readonly Permission[] = [
  "products.manage",
  "categories.manage",
  "orders.manage",
  "reviews.manage",
  "customers.manage",
  "media.manage",
];

const rolePermissions: Record<UserRole, readonly Permission[]> = {
  ADMIN: ALL_PERMISSIONS,
  MANAGER: MANAGER_PERMISSIONS,
};

export function getPermissionsForRole(role: UserRole): readonly Permission[] {
  return rolePermissions[role];
}

export function can(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}
