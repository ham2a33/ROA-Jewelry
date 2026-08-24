"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminCard } from "@/components/admin/ui/AdminPageHeader";
import {
  createAdminUser,
  updateAdminUser,
} from "@/server/actions/admin/users";

type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER";
  isActive: boolean;
};

type AdminUsersManagerProps = {
  users: AdminUserRow[];
  currentUserId: string;
};

export function AdminUsersManager({
  users,
  currentUserId,
}: AdminUsersManagerProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    password: "",
    role: "MANAGER" as "ADMIN" | "MANAGER",
  });

  function createUser() {
    startTransition(async () => {
      const result = await createAdminUser(draft);
      setMessage(result.success ? "Пользователь создан" : result.message);
      router.refresh();
    });
  }

  function saveUser(user: AdminUserRow) {
    startTransition(async () => {
      const result = await updateAdminUser(user);
      setMessage(result.success ? "Пользователь обновлён" : result.message);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <AdminCard title="Create admin">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Name"
            className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
          />
          <input
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            placeholder="Email"
            className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
          />
          <input
            value={draft.password}
            onChange={(e) => setDraft({ ...draft, password: e.target.value })}
            placeholder="Password"
            type="password"
            className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
          />
          <select
            value={draft.role}
            onChange={(e) =>
              setDraft({
                ...draft,
                role: e.target.value as "ADMIN" | "MANAGER",
              })
            }
            className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
          >
            <option value="MANAGER">MANAGER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <AdminButton className="mt-3" size="sm" disabled={isPending} onClick={createUser}>
          Create
        </AdminButton>
      </AdminCard>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-neutral-100">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <AdminButton
                    size="sm"
                    variant="secondary"
                    disabled={isPending || user.id === currentUserId}
                    onClick={() =>
                      saveUser({
                        ...user,
                        isActive: !user.isActive,
                      })
                    }
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </AdminButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message ? <p className="text-sm text-neutral-600">{message}</p> : null}
    </div>
  );
}
