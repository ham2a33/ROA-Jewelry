"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { runClientAction } from "@/lib/admin/client-action";
import { updateReviewStatus, deleteReview } from "@/server/actions/admin/reviews";

type ReviewActionsProps = {
  id: string;
  isApproved: boolean;
  isPublished: boolean;
};

export function ReviewActions({
  id,
  isPublished,
}: ReviewActionsProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function update(next: { isApproved: boolean; isPublished: boolean }) {
    setMessage(null);
    startTransition(async () => {
      const actionResult = await runClientAction(() =>
        updateReviewStatus({ id, ...next }),
      );
      if (actionResult.ok && actionResult.value.success) {
        router.refresh();
      } else {
        setMessage(
          actionResult.ok
            ? actionResult.value.success
              ? null
              : actionResult.value.message
            : actionResult.message,
        );
      }
    });
  }

  function remove() {
    if (!confirm("Удалить отзыв?")) {
      return;
    }
    setMessage(null);
    startTransition(async () => {
      const actionResult = await runClientAction(() => deleteReview(id));
      if (actionResult.ok && actionResult.value.success) {
        router.refresh();
      } else {
        setMessage(
          actionResult.ok
            ? actionResult.value.success
              ? null
              : actionResult.value.message
            : actionResult.message,
        );
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {!isPublished ? (
        <AdminButton
          size="sm"
          disabled={isPending}
          onClick={() => update({ isApproved: true, isPublished: true })}
        >
          Approve
        </AdminButton>
      ) : (
        <AdminButton
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() => update({ isApproved: false, isPublished: false })}
        >
          Hide
        </AdminButton>
      )}
      <AdminButton size="sm" variant="danger" disabled={isPending} onClick={remove}>
        Delete
      </AdminButton>
      {message ? <p className="basis-full text-sm text-rose-600">{message}</p> : null}
    </div>
  );
}
