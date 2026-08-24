import { requireAuth } from "@/lib/auth/guards";
import { AdminShell } from "@/components/admin/layout/AdminShell";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <AdminShell userName={user.name} role={user.role}>
      {children}
    </AdminShell>
  );
}
