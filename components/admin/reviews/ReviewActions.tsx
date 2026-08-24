"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AdminButton } from "@/components/admin/ui/AdminButton";
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
  const [isPending, startTransition] = useTransition();

  function update(next: { isApproved: boolean; isPublished: boolean }) {
    startTransition(async () => {
      await updateReviewStatus({ id, ...next });
      router.refresh();
    });
  }

  function remove() {
    if (!confirm("Удалить отзыв?")) {
      return;
    }
    startTransition(async () => {
      await deleteReview(id);
      router.refresh();
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
    </div>
  );
}
