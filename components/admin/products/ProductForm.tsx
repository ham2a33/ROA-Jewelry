"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { siteConfig } from "@/lib/config/site-config";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminCard } from "@/components/admin/ui/AdminPageHeader";
import {
  createProduct,
  updateProduct,
  deactivateProduct,
  deleteProduct,
} from "@/server/actions/admin/products";

type CategoryOption = { id: string; name: string };

type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice: string;
  sku: string;
  stock: number;
  material: string;
  hallmark: string;
  weightGrams: string;
  categoryId: string;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
};

type ProductFormProps = {
  categories: CategoryOption[];
  initialValues?: Partial<ProductFormValues>;
  mode: "create" | "edit";
};

const emptyValues: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: "",
  compareAtPrice: "",
  sku: "",
  stock: 0,
  material: "",
  hallmark: "",
  weightGrams: "",
  categoryId: "",
  isNew: false,
  isBestseller: false,
  isFeatured: false,
  isActive: true,
  seoTitle: "",
  seoDescription: "",
};

export function ProductForm({
  categories,
  initialValues,
  mode,
}: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({
    ...emptyValues,
    ...initialValues,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const payload = {
        ...values,
        compareAtPrice: values.compareAtPrice || null,
        weightGrams: values.weightGrams || null,
        description: values.description || undefined,
        shortDescription: values.shortDescription || undefined,
        material: values.material || undefined,
        hallmark: values.hallmark || undefined,
        seoTitle: values.seoTitle || undefined,
        seoDescription: values.seoDescription || undefined,
      };

      const result =
        mode === "create"
          ? await createProduct(payload)
          : await updateProduct({ ...payload, id: values.id });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(mode === "create" ? "Товар создан" : "Товар обновлён");
      if (mode === "create" && result.id) {
        router.push(`${siteConfig.routes.admin.products}/${result.id}`);
      } else {
        router.refresh();
      }
    });
  }

  function handleDeactivate() {
    if (!values.id || !confirm("Деактивировать товар?")) {
      return;
    }

    startTransition(async () => {
      const result = await deactivateProduct(values.id!);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setSuccess("Товар деактивирован");
      router.refresh();
    });
  }

  function handleDelete() {
    if (!values.id || !confirm("Удалить товар? Это действие нельзя отменить.")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProduct(values.id!);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push(siteConfig.routes.admin.products);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminCard title="Основная информация">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">Название</span>
            <input
              value={values.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">Slug</span>
            <input
              value={values.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
              required
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-neutral-600">Описание</span>
            <textarea
              value={values.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="min-h-24 w-full rounded-md border border-neutral-200 px-3 py-2"
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-neutral-600">Короткое описание</span>
            <textarea
              value={values.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              className="min-h-16 w-full rounded-md border border-neutral-200 px-3 py-2"
            />
          </label>
        </div>
      </AdminCard>

      <AdminCard title="Цена и инвентарь">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">Цена</span>
            <input
              value={values.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">Цена до скидки</span>
            <input
              value={values.compareAtPrice}
              onChange={(e) => updateField("compareAtPrice", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">SKU</span>
            <input
              value={values.sku}
              onChange={(e) => updateField("sku", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">Stock</span>
            <input
              type="number"
              min={0}
              value={values.stock}
              onChange={(e) => updateField("stock", Number(e.target.value))}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
            />
          </label>
        </div>
      </AdminCard>

      <AdminCard title="Product data">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">Материал</span>
            <input
              value={values.material}
              onChange={(e) => updateField("material", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">Проба</span>
            <input
              value={values.hallmark}
              onChange={(e) => updateField("hallmark", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-neutral-600">Вес (г)</span>
            <input
              value={values.weightGrams}
              onChange={(e) => updateField("weightGrams", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
            />
          </label>
          <label className="text-sm md:col-span-3">
            <span className="mb-1 block text-neutral-600">Категория</span>
            <select
              value={values.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </AdminCard>

      <AdminCard title="Flags / SEO">
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              ["isActive", "Active"],
              ["isFeatured", "Featured"],
              ["isBestseller", "Bestseller"],
              ["isNew", "New"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values[key]}
                onChange={(e) => updateField(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-neutral-600">SEO title</span>
            <input
              value={values.seoTitle}
              onChange={(e) => updateField("seoTitle", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 px-3"
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-neutral-600">SEO description</span>
            <textarea
              value={values.seoDescription}
              onChange={(e) => updateField("seoDescription", e.target.value)}
              className="min-h-16 w-full rounded-md border border-neutral-200 px-3 py-2"
            />
          </label>
        </div>
      </AdminCard>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

      <div className="flex flex-wrap gap-2">
        <AdminButton type="submit" disabled={isPending}>
          {isPending ? "Сохранение..." : "Сохранить"}
        </AdminButton>
        {mode === "edit" ? (
          <>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={handleDeactivate}
              disabled={isPending}
            >
              Deactivate
            </AdminButton>
            <AdminButton
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete
            </AdminButton>
          </>
        ) : null}
      </div>
    </form>
  );
}
