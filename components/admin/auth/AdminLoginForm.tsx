"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { siteConfig } from "@/lib/config/site-config";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import {
  bootstrapFirstAdmin,
  loginAdmin,
} from "@/server/actions/admin/auth";

type AdminLoginFormProps = {
  showBootstrap: boolean;
};

type FieldErrors = Partial<Record<"name" | "email" | "password", string>>;

const inputClass =
  "h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-neutral-400";

function fieldClass(hasError: boolean): string {
  return `${inputClass} ${hasError ? "border-rose-300" : "border-neutral-200"}`;
}

export function AdminLoginForm({ showBootstrap }: AdminLoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const payload = {
        email: email.trim(),
        password,
        ...(showBootstrap ? { name: name.trim() } : {}),
      };

      const result = showBootstrap
        ? await bootstrapFirstAdmin(payload)
        : await loginAdmin(payload);

      if (!result.success) {
        setError(result.message);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      router.push(siteConfig.routes.admin.dashboard);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showBootstrap ? (
        <label className="block text-sm">
          <span className="mb-1 block text-neutral-600">Имя</span>
          <input
            autoComplete="name"
            className={fieldClass(Boolean(fieldErrors.name))}
            name="name"
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
          {fieldErrors.name ? (
            <p className="mt-1 text-sm text-rose-600">{fieldErrors.name}</p>
          ) : null}
        </label>
      ) : null}

      <label className="block text-sm">
        <span className="mb-1 block text-neutral-600">Email</span>
        <input
          autoComplete="email"
          className={fieldClass(Boolean(fieldErrors.email))}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
        {fieldErrors.email ? (
          <p className="mt-1 text-sm text-rose-600">{fieldErrors.email}</p>
        ) : null}
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-neutral-600">Пароль</span>
        <input
          autoComplete={showBootstrap ? "new-password" : "current-password"}
          className={fieldClass(Boolean(fieldErrors.password))}
          minLength={8}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
        {fieldErrors.password ? (
          <p className="mt-1 text-sm text-rose-600">{fieldErrors.password}</p>
        ) : null}
      </label>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <AdminButton type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? showBootstrap
            ? "Создание..."
            : "Вход..."
          : showBootstrap
            ? "Создать администратора"
            : "Войти"}
      </AdminButton>
    </form>
  );
}
