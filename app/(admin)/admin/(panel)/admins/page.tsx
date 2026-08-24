import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminUsersManager } from "@/components/admin/users/AdminUsersManager";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAdminUsers } from "@/server/queries/admin/homepage";

export default async function AdminUsersPage() {
  const currentUser = await requireAdminRole();
  const users = await getAdminUsers();

  return (
    <div>
      <AdminPageHeader title="Users" description="Administration users" />
      <AdminUsersManager users={users} currentUserId={currentUser.id} />
    </div>
  );
}
