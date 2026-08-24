"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminCard } from "@/components/admin/ui/AdminPageHeader";
import { updateProfile } from "@/server/actions/admin/auth";

type ProfileFormProps = {
  initial: {
    name: string;
    email: string;
  };
};

export function ProfileForm({ initial }: ProfileFormProps) {
  const router = useRouter();
  const [values, setValues] = useState({
    ...initial,
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateProfile(values);
      setMessage(result.success ? "Профиль сохранён" : result.message);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <AdminCard title="Profile">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">Name</span>
            <input
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">Email</span>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">Current password</span>
            <input
              type="password"
              value={values.currentPassword}
              onChange={(e) =>
                setValues({ ...values, currentPassword: e.target.value })
              }
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">New password</span>
            <input
              type="password"
              value={values.newPassword}
              onChange={(e) =>
                setValues({ ...values, newPassword: e.target.value })
              }
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
              minLength={8}
            />
          </label>
        </div>
      </AdminCard>
      {message ? <p className="mt-3 text-sm text-neutral-600">{message}</p> : null}
      <AdminButton type="submit" className="mt-4" disabled={isPending}>
        {isPending ? "Сохранение..." : "Сохранить"}
      </AdminButton>
    </form>
  );
}
