import { AdminLoginForm } from "@/components/admin/auth/AdminLoginForm";
import { getAdminLoginBootstrapState } from "@/server/queries/admin/auth-page";

export default async function AdminLoginPage() {
  const { showBootstrap } = await getAdminLoginBootstrapState();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            ROA Admin
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
            {showBootstrap ? "Первоначальная настройка" : "Вход в админку"}
          </h1>
        </div>
        <AdminLoginForm showBootstrap={showBootstrap} />
      </div>
    </div>
  );
}
