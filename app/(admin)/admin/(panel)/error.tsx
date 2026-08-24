"use client";

import { useEffect } from "react";
import { AdminButton } from "@/components/admin/ui/AdminButton";

export default function AdminPanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-6">
      <h2 className="text-lg font-semibold text-rose-900">
        Не удалось загрузить данные
      </h2>
      <p className="mt-2 text-sm text-rose-700">
        Попробуйте ещё раз. Если проблема повторяется, проверьте подключение к
        базе данных.
      </p>
      <AdminButton className="mt-4" variant="secondary" onClick={reset}>
        Повторить
      </AdminButton>
    </div>
  );
}
