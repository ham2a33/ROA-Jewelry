"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminCard } from "@/components/admin/ui/AdminPageHeader";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import {
  deleteProductVariant,
  upsertProductVariant,
} from "@/server/actions/admin/products";
import type { AdminMediaPickerValue } from "@/types/admin-media";

type VariantRow = {
  id?: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  isActive: boolean;
  image: AdminMediaPickerValue;
};

type ProductVariantsSectionProps = {
  productId: string;
  variants: VariantRow[];
};

export function ProductVariantsSection({
  productId,
  variants: initialVariants,
}: ProductVariantsSectionProps) {
  const router = useRouter();
  const [variants, setVariants] = useState(initialVariants);
  const [draft, setDraft] = useState<VariantRow>({
    name: "",
    sku: "",
    price: "",
    stock: 0,
    isActive: true,
    image: null,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function saveVariant(variant: VariantRow) {
    startTransition(async () => {
      const result = await upsertProductVariant({
        ...variant,
        productId,
        price: variant.price || null,
        imageId: variant.image?.id ?? null,
      });
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setMessage("Вариант сохранён");
      router.refresh();
    });
  }

  function handleVariantImageChange(variantId: string | undefined, image: AdminMediaPickerValue) {
    if (!variantId) {
      return;
    }

    setVariants((rows) =>
      rows.map((row) => (row.id === variantId ? { ...row, image } : row)),
    );

    const variant = variants.find((row) => row.id === variantId);
    if (!variant) {
      return;
    }

    startTransition(async () => {
      const result = await upsertProductVariant({
        ...variant,
        productId,
        price: variant.price || null,
        imageId: image?.id ?? null,
      });
      setMessage(
        result.success ? "Фото варианта сохранено" : result.message,
      );
      if (result.success) {
        router.refresh();
      }
    });
  }

  function removeVariant(variantId: string) {
    if (!confirm("Удалить вариант?")) {
      return;
    }
    startTransition(async () => {
      await deleteProductVariant(variantId);
      setVariants((current) => current.filter((item) => item.id !== variantId));
      router.refresh();
    });
  }

  return (
    <AdminCard title="Варианты">
      <div className="space-y-4">
        {variants.map((variant) => (
          <div
            key={variant.id ?? variant.sku}
            className="space-y-3 rounded-md border border-neutral-200 p-3"
          >
            <div className="grid gap-3 md:grid-cols-5">
              <input
                value={variant.name}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row) =>
                      row.id === variant.id ? { ...row, name: e.target.value } : row,
                    ),
                  )
                }
                placeholder="Размер"
                className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
              />
              <input
                value={variant.sku}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row) =>
                      row.id === variant.id ? { ...row, sku: e.target.value } : row,
                    ),
                  )
                }
                placeholder="SKU"
                className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
              />
              <input
                value={variant.price}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row) =>
                      row.id === variant.id ? { ...row, price: e.target.value } : row,
                    ),
                  )
                }
                placeholder="Цена"
                className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
              />
              <input
                type="number"
                value={variant.stock}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row) =>
                      row.id === variant.id
                        ? { ...row, stock: Number(e.target.value) }
                        : row,
                    ),
                  )
                }
                placeholder="Stock"
                className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
              />
              <div className="flex gap-2">
                <AdminButton
                  size="sm"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() => saveVariant(variant)}
                >
                  Save
                </AdminButton>
                {variant.id ? (
                  <AdminButton
                    size="sm"
                    variant="danger"
                    disabled={isPending}
                    onClick={() => removeVariant(variant.id!)}
                  >
                    Delete
                  </AdminButton>
                ) : null}
              </div>
            </div>

            {variant.id ? (
              <MediaPickerField
                label="Фото варианта"
                value={variant.image}
                onChange={(image) => handleVariantImageChange(variant.id, image)}
                uploadLabel="Загрузить фото"
                libraryLabel="Выбрать из Media"
                aspectClassName="aspect-square max-w-[160px]"
              />
            ) : null}
          </div>
        ))}

        <div className="grid gap-3 rounded-md border border-dashed border-neutral-200 p-3 md:grid-cols-5">
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Новый размер"
            className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
          />
          <input
            value={draft.sku}
            onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
            placeholder="SKU"
            className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
          />
          <input
            value={draft.price}
            onChange={(e) => setDraft({ ...draft, price: e.target.value })}
            placeholder="Цена"
            className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
          />
          <input
            type="number"
            value={draft.stock}
            onChange={(e) =>
              setDraft({ ...draft, stock: Number(e.target.value) })
            }
            placeholder="Stock"
            className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
          />
          <AdminButton
            size="sm"
            disabled={isPending}
            onClick={() => {
              saveVariant(draft);
              setDraft({
                name: "",
                sku: "",
                price: "",
                stock: 0,
                isActive: true,
                image: null,
              });
            }}
          >
            Добавить
          </AdminButton>
        </div>

        {message ? <p className="text-sm text-neutral-600">{message}</p> : null}
      </div>
    </AdminCard>
  );
}
