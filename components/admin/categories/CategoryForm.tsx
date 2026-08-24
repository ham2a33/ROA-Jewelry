"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { siteConfig } from "@/lib/config/site-config";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminCard } from "@/components/admin/ui/AdminPageHeader";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/server/actions/admin/categories";
import type { AdminMediaPickerValue } from "@/types/admin-media";

type CategoryFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
};

type CategoryFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<CategoryFormValues>;
  initialImage?: AdminMediaPickerValue;
};

const defaults: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
  isActive: true,
  seoTitle: "",
  seoDescription: "",
};

export function CategoryForm({
  mode,
  initialValues,
  initialImage = null,
}: CategoryFormProps) {
  const router = useRouter();
  const [values, setValues] = useState({ ...defaults, ...initialValues });
  const [image, setImage] = useState<AdminMediaPickerValue>(initialImage);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleImageChange(nextImage: AdminMediaPickerValue) {
    setImage(nextImage);

    if (mode !== "edit" || !values.id) {
      return;
    }

    startTransition(async () => {
      const result = await updateCategory({
        id: values.id,
        name: values.name,
        slug: values.slug,
        description: values.description || undefined,
        imageId: nextImage?.id ?? null,
        sortOrder: values.sortOrder,
        isActive: values.isActive,
        seoTitle: values.seoTitle || undefined,
        seoDescription: values.seoDescription || undefined,
      });
      setMessage(
        result.success ? "Изображение категории сохранено" : result.message,
      );
      if (result.success) {
        router.refresh();
      }
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const payload = {
        ...values,
        description: values.description || undefined,
        imageId: image?.id ?? null,
        seoTitle: values.seoTitle || undefined,
        seoDescription: values.seoDescription || undefined,
      };
      const result =
        mode === "create"
          ? await createCategory(payload)
          : await updateCategory({ ...payload, id: values.id });
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setMessage(mode === "create" ? "Категория создана" : "Категория обновлена");
      if (mode === "create" && result.id) {
        router.push(`${siteConfig.routes.admin.categories}/${result.id}`);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!values.id || !confirm("Удалить категорию?")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteCategory(values.id!);
      setMessage(result.success ? "Категория удалена" : result.message);
      if (result.success) {
        router.push(siteConfig.routes.admin.categories);
      }
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <AdminCard title="Категория">
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              ["name", "Name"],
              ["slug", "Slug"],
              ["description", "Description"],
              ["sortOrder", "Sort order"],
              ["seoTitle", "SEO title"],
              ["seoDescription", "SEO description"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="text-sm">
              <span className="mb-1 block text-neutral-600">{label}</span>
              {key === "description" || key === "seoDescription" ? (
                <textarea
                  className="min-h-20 w-full rounded-md border border-neutral-200 px-3 py-2"
                  onChange={(e) =>
                    setValues((current) => ({ ...current, [key]: e.target.value }))
                  }
                  value={String(values[key])}
                />
              ) : (
                <input
                  className="h-10 w-full rounded-md border border-neutral-200 px-3"
                  onChange={(e) =>
                    setValues((current) => ({
                      ...current,
                      [key]:
                        key === "sortOrder"
                          ? Number(e.target.value)
                          : e.target.value,
                    }))
                  }
                  required={key === "name" || key === "slug"}
                  type={key === "sortOrder" ? "number" : "text"}
                  value={String(values[key])}
                />
              )}
            </label>
          ))}

          <div className="md:col-span-2">
            <MediaPickerField
              label="Category image"
              value={image}
              onChange={handleImageChange}
              helperText="Отображается на главной и в каталоге."
              uploadLabel="Загрузить фото"
              libraryLabel="Выбрать из Media"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              checked={values.isActive}
              onChange={(e) =>
                setValues((current) => ({ ...current, isActive: e.target.checked }))
              }
              type="checkbox"
            />
            Active
          </label>
        </div>
      </AdminCard>
      {message ? <p className="text-sm text-neutral-600">{message}</p> : null}
      <div className="flex gap-2">
        <AdminButton disabled={isPending} type="submit">
          {isPending ? "Сохранение..." : "Сохранить"}
        </AdminButton>
        {mode === "edit" ? (
          <AdminButton
            disabled={isPending}
            onClick={handleDelete}
            type="button"
            variant="danger"
          >
            Delete
          </AdminButton>
        ) : null}
      </div>
    </form>
  );
}
