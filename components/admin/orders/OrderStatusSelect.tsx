"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
  ORDER_STATUS_STYLES,
} from "@/lib/admin/constants";
import { AdminStatusBadge } from "@/components/admin/ui/AdminStatusBadge";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { updateOrderStatus } from "@/server/actions/admin/orders";
import type { OrderStatus } from "@/generated/prisma/client";

type OrderStatusSelectProps = {
  orderId: string;
  status: OrderStatus;
};

export function OrderStatusSelect({ orderId, status }: OrderStatusSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(nextStatus: OrderStatus) {
    setValue(nextStatus);
    setMessage(null);

    startTransition(async () => {
      const result = await updateOrderStatus({ orderId, status: nextStatus });
      if (!result.success) {
        setValue(status);
        setMessage(result.message);
        return;
      }
      setMessage("Заказ обновлён");
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <AdminStatusBadge
          label={ORDER_STATUS_LABELS[value]}
          className={ORDER_STATUS_STYLES[value]}
        />
        <select
          value={value}
          disabled={isPending}
          onChange={(event) => handleChange(event.target.value as OrderStatus)}
          className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
        >
          {ORDER_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {ORDER_STATUS_LABELS[option]}
            </option>
          ))}
        </select>
      </div>
      {message ? <p className="text-sm text-neutral-600">{message}</p> : null}
    </div>
  );
}

type CopyOrderNumberProps = {
  orderNumber: string;
};

export function CopyOrderNumber({ orderNumber }: CopyOrderNumberProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AdminButton variant="secondary" size="sm" onClick={handleCopy}>
      {copied ? "Скопировано" : "Копировать номер"}
    </AdminButton>
  );
}
