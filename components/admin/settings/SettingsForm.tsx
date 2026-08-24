"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminCard } from "@/components/admin/ui/AdminPageHeader";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { updateSiteSettings } from "@/server/actions/admin/settings";
import type { AdminMediaPickerValue } from "@/types/admin-media";

type SettingsMediaField = {
  key: "logoId" | "faviconId" | "defaultOgImageId";
  label: string;
  helperText?: string;
  aspectClassName?: string;
  uploadLabel?: string;
  libraryLabel?: string;
};

type SettingsFormProps = {
  initialValues: Record<string, string | null | undefined>;
  title: string;
  fields: Array<{
    key: string;
    label: string;
    type?: "text" | "textarea" | "url" | "email" | "tel";
    placeholder?: string;
    helperText?: string;
  }>;
  mediaFields?: SettingsMediaField[];
  initialMedia?: Partial<
    Record<SettingsMediaField["key"], AdminMediaPickerValue>
  >;
};

function buildInitialValues(
  initialValues: Record<string, string | null | undefined>,
  fields: SettingsFormProps["fields"],
): Record<string, string> {
  const next: Record<string, string> = {
    siteName: initialValues.siteName ?? "ROA Jewelry",
  };

  for (const [key, value] of Object.entries(initialValues)) {
    if (value != null && value !== "") {
      next[key] = String(value);
    }
  }

  for (const field of fields) {
    if (!(field.key in next)) {
      next[field.key] = "";
    }
  }

  return next;
}

export function SettingsForm({
  initialValues,
  title,
  fields,
  mediaFields = [],
  initialMedia = {},
}: SettingsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildInitialValues(initialValues, fields),
  );
  const [media, setMedia] = useState<
    Partial<Record<SettingsMediaField["key"], AdminMediaPickerValue>>
  >(initialMedia);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function buildPayload(
    nextMedia: Partial<
      Record<SettingsMediaField["key"], AdminMediaPickerValue>
    > = media,
  ) {
    return {
      siteName: values.siteName || initialValues.siteName || "ROA Jewelry",
      tagline: values.tagline ?? initialValues.tagline ?? undefined,
      contactEmail: values.contactEmail ?? initialValues.contactEmail ?? undefined,
      contactPhone: values.contactPhone ?? initialValues.contactPhone ?? undefined,
      address: values.address ?? initialValues.address ?? undefined,
      instagramUrl: values.instagramUrl ?? initialValues.instagramUrl ?? "",
      whatsappUrl: values.whatsappUrl ?? initialValues.whatsappUrl ?? "",
      telegramUrl: values.telegramUrl ?? initialValues.telegramUrl ?? "",
      defaultSeoTitle:
        values.defaultSeoTitle ?? initialValues.defaultSeoTitle ?? undefined,
      defaultSeoDescription:
        values.defaultSeoDescription ??
        initialValues.defaultSeoDescription ??
        undefined,
      logoId: nextMedia.logoId?.id ?? initialValues.logoId ?? null,
      faviconId: nextMedia.faviconId?.id ?? initialValues.faviconId ?? null,
      defaultOgImageId:
        nextMedia.defaultOgImageId?.id ?? initialValues.defaultOgImageId ?? null,
    };
  }

  function handleMediaChange(
    key: SettingsMediaField["key"],
    value: AdminMediaPickerValue,
  ) {
    const nextMedia = { ...media, [key]: value };
    setMedia(nextMedia);

    if (mediaFields.length === 0) {
      return;
    }

    startTransition(async () => {
      const result = await updateSiteSettings(buildPayload(nextMedia));
      setMessage(result.success ? "Изображение сохранено" : result.message);
      if (result.success) {
        router.refresh();
      }
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateSiteSettings(buildPayload());
      setMessage(result.success ? "Настройки сохранены" : result.message);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <AdminCard title={title}>
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key} className="text-sm md:col-span-2">
              <span className="mb-1 block text-neutral-600">{field.label}</span>
              {field.helperText ? (
                <span className="mb-2 block text-xs text-neutral-500">
                  {field.helperText}
                </span>
              ) : null}
              {field.type === "textarea" ? (
                <textarea
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ""}
                  onChange={(e) =>
                    setValues((current) => ({
                      ...current,
                      [field.key]: e.target.value,
                    }))
                  }
                  className="min-h-24 w-full rounded-md border border-neutral-200 px-3 py-2"
                />
              ) : (
                <input
                  placeholder={field.placeholder}
                  type={field.type ?? "text"}
                  value={values[field.key] ?? ""}
                  onChange={(e) =>
                    setValues((current) => ({
                      ...current,
                      [field.key]: e.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-md border border-neutral-200 px-3"
                />
              )}
            </label>
          ))}

          {mediaFields.map((field) => (
            <div className="md:col-span-2" key={field.key}>
              <MediaPickerField
                aspectClassName={field.aspectClassName}
                helperText={field.helperText}
                label={field.label}
                libraryLabel={field.libraryLabel ?? "Выбрать из Media"}
                onChange={(value) => handleMediaChange(field.key, value)}
                uploadLabel={field.uploadLabel ?? "Загрузить фото"}
                value={media[field.key] ?? null}
              />
            </div>
          ))}
        </div>
      </AdminCard>
      {message ? <p className="mt-3 text-sm text-neutral-600">{message}</p> : null}
      <AdminButton type="submit" className="mt-4" disabled={isPending}>
        {isPending ? "Сохранение..." : "Сохранить"}
      </AdminButton>
    </form>
  );
}
