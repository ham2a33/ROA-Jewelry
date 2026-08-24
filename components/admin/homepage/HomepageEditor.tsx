"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { siteConfig } from "@/lib/config/site-config";
import { HOMEPAGE_PROMO_BANNER_SLOT } from "@/lib/homepage/image-slots";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminCard } from "@/components/admin/ui/AdminPageHeader";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { updateHomepageSection } from "@/server/actions/admin/homepage";
import type { AdminMediaPickerValue } from "@/types/admin-media";

type HomepageSectionItem = {
  id: string;
  key: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  image: AdminMediaPickerValue;
  mobileImage: AdminMediaPickerValue;
};

type HomepageEditorProps = {
  sections: HomepageSectionItem[];
};

function sectionHasImages(section: HomepageSectionItem): boolean {
  return ["HERO", "ABOUT", "FINAL_CTA"].includes(section.type);
}

export function HomepageEditor({ sections }: HomepageEditorProps) {
  const router = useRouter();
  const [rows, setRows] = useState(sections);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function saveSection(section: HomepageSectionItem) {
    startTransition(async () => {
      const result = await updateHomepageSection({
        id: section.id,
        type: section.type,
        key: section.key,
        title: section.title ?? undefined,
        subtitle: section.subtitle ?? undefined,
        description: section.description ?? undefined,
        buttonText: section.buttonText ?? undefined,
        buttonUrl: section.buttonUrl ?? undefined,
        imageId: section.image?.id ?? null,
        mobileImageId: section.mobileImage?.id ?? null,
        isActive: section.isActive,
        sortOrder: section.sortOrder,
      });
      setMessage(result.success ? "Секция сохранена" : result.message);
      router.refresh();
    });
  }

  function updateSection(
    sectionId: string,
    patch: Partial<HomepageSectionItem>,
    autoSave = false,
  ) {
    setRows((current) => {
      const next = current.map((row) =>
        row.id === sectionId ? { ...row, ...patch } : row,
      );
      if (autoSave) {
        const section = next.find((row) => row.id === sectionId);
        if (section) {
          saveSection(section);
        }
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <a href={siteConfig.routes.home} rel="noreferrer" target="_blank">
          <AdminButton variant="secondary">Открыть сайт</AdminButton>
        </a>
      </div>

      {rows
        .filter((section) => section.key !== HOMEPAGE_PROMO_BANNER_SLOT.key)
        .map((section) => (
        <AdminCard key={section.id} title={`${section.type} · ${section.key}`}>
          <div className="grid gap-3 md:grid-cols-2">
            {(
              [
                ["title", "Title"],
                ["subtitle", "Subtitle"],
                ["buttonText", "CTA text"],
                ["buttonUrl", "CTA URL"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="text-sm">
                <span className="mb-1 block text-neutral-600">{label}</span>
                <input
                  value={section[key] ?? ""}
                  onChange={(e) =>
                    updateSection(section.id, { [key]: e.target.value })
                  }
                  className="h-10 w-full rounded-md border border-neutral-200 px-3"
                />
              </label>
            ))}
            <label className="text-sm md:col-span-2">
              <span className="mb-1 block text-neutral-600">Description</span>
              <textarea
                value={section.description ?? ""}
                onChange={(e) =>
                  updateSection(section.id, { description: e.target.value })
                }
                className="min-h-24 w-full rounded-md border border-neutral-200 px-3 py-2"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={section.isActive}
                onChange={(e) =>
                  updateSection(section.id, { isActive: e.target.checked })
                }
              />
              Active
            </label>
          </div>

          {sectionHasImages(section) ? (
            <div className="mt-6 grid gap-6 border-t border-neutral-200 pt-6 md:grid-cols-2">
              <MediaPickerField
                label="Desktop image"
                value={section.image}
                onChange={(image) => updateSection(section.id, { image }, true)}
                helperText="Основное изображение секции на десктопе."
                uploadLabel="Загрузить изображение"
                libraryLabel="Выбрать из Media"
              />
              <MediaPickerField
                label="Mobile image"
                value={section.mobileImage}
                onChange={(mobileImage) =>
                  updateSection(section.id, { mobileImage }, true)
                }
                helperText="Необязательно. Если не задано, используется основное."
                uploadLabel="Загрузить изображение"
                libraryLabel="Выбрать из Media"
                allowRemove
              />
            </div>
          ) : null}

          <AdminButton
            className="mt-4"
            size="sm"
            disabled={isPending}
            onClick={() =>
              saveSection(rows.find((row) => row.id === section.id)!)
            }
          >
            Сохранить секцию
          </AdminButton>
        </AdminCard>
      ))}

      {message ? <p className="text-sm text-neutral-600">{message}</p> : null}
    </div>
  );
}
