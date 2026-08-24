"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { CoverImage } from "@/components/ui/CoverImage";
import { AdminCard, AdminEmptyState } from "@/components/admin/ui/AdminPageHeader";
import {
  deleteAdminMedia,
} from "@/server/actions/admin/media";
import {
  MEDIA_UPLOAD_ACCEPT,
  uploadAdminMediaFile,
} from "@/components/admin/media/upload-admin-media-file";
import { MEDIA_UPLOAD_HINT } from "@/lib/media/constants";

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string | Date;
};

type MediaLibraryProps = {
  items: MediaItem[];
};

function formatBytes(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ items }: MediaLibraryProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    startTransition(async () => {
      const result = await uploadAdminMediaFile(file);
      setMessage(result.success ? "Файл загружен" : result.message);
      if (result.success) {
        router.refresh();
      }
    });
  }

  function handleDelete(mediaId: string) {
    if (!confirm("Удалить файл?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminMedia(mediaId);
      setMessage(result.success ? "Файл удалён" : result.message);
      router.refresh();
    });
  }

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage("URL скопирован");
  }

  return (
    <div className="space-y-4">
      <AdminCard
        title="Upload"
        action={
          <label className="inline-flex cursor-pointer items-center">
            <span className="inline-flex h-8 items-center rounded-md border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-900">
              Загрузить
            </span>
            <input
              accept={MEDIA_UPLOAD_ACCEPT}
              className="hidden"
              disabled={isPending}
              onChange={handleUpload}
              type="file"
            />
          </label>
        }
      >
        <p className="text-sm text-neutral-500">{MEDIA_UPLOAD_HINT}</p>
      </AdminCard>

      {message ? <p className="text-sm text-neutral-600 whitespace-pre-line">{message}</p> : null}

      {items.length === 0 ? (
        <AdminEmptyState title="Медиафайлов пока нет." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <CoverImage
                  alt={item.filename}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  src={item.url}
                />
              </div>
              <div className="space-y-2 p-3 text-sm">
                <p className="truncate font-medium">{item.filename}</p>
                <p className="text-neutral-500">{item.mimeType}</p>
                <p className="text-neutral-500">{formatBytes(item.size)}</p>
                <div className="flex gap-2">
                  <AdminButton
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopy(item.url)}
                  >
                    Copy URL
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="danger"
                    disabled={isPending}
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
