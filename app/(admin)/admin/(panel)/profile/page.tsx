import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ProfileForm } from "@/components/admin/profile/ProfileForm";
import { requireAuth } from "@/lib/auth/guards";

export default async function AdminProfilePage() {
  const user = await requireAuth();

  return (
    <div>
      <AdminPageHeader title="Profile" />
      <ProfileForm initial={{ name: user.name, email: user.email }} />
    </div>
  );
}
