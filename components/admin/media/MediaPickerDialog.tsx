"use client";

import { useEffect, useState, useTransition } from "react";
import { Search, Upload, X } from "lucide-react";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { CoverImage } from "@/components/ui/CoverImage";
import { formatBytes } from "@/components/admin/media/format-bytes";
import { fetchMediaPickerItems } from "@/server/actions/admin/media-picker";
import {
  MEDIA_UPLOAD_ACCEPT,
  uploadAdminMediaFile,
} from "@/components/admin/media/upload-admin-media-file";
import { MEDIA_UPLOAD_HINT } from "@/lib/media/constants";
import { cn } from "@/lib/utils/cn";
import type { AdminMediaItem } from "@/types/admin-media";

type MediaPickerDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (item: AdminMediaItem) => void;
  selectedId?: string | null;
  title?: string;
};

type MediaPickerDialogContentProps = Omit<MediaPickerDialogProps, "open">;

function MediaPickerDialogContent({
  onClose,
  onSelect,
  selectedId,
  title = "Выберите изображение",
}: MediaPickerDialogContentProps) {
  const [items, setItems] = useState<AdminMediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(selectedId ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadItems("", 1);
  }, []);

  function loadItems(query: string, nextPage: number) {
    startTransition(async () => {
      const result = await fetchMediaPickerItems({
        search: query.trim() || undefined,
        page: nextPage,
      });
      setItems(result.items);
      setPage(result.page);
      setTotalPages(result.totalPages);
    });
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    loadItems(search, 1);
  }

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    startTransition(async () => {
      const result = await uploadAdminMediaFile(file);
      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setItems((current) => [result.item, ...current]);
      setPendingId(result.item.id);
      setMessage("Изображение загружено");
    });

    event.target.value = "";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        type="button"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <button
            aria-label="Закрыть"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-4 border-b border-neutral-200 px-5 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center">
              <span className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50">
                <Upload className="h-4 w-4" strokeWidth={1.5} />
                Загрузить новое
              </span>
              <input
                accept={MEDIA_UPLOAD_ACCEPT}
                className="hidden"
                disabled={isPending}
                onChange={handleUpload}
                type="file"
              />
            </label>

            <p className="w-full text-xs text-neutral-500">{MEDIA_UPLOAD_HINT}</p>

            <form className="min-w-[220px] flex-1" onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400"
                  strokeWidth={1.5}
                />
                <input
                  className="h-9 w-full rounded-md border border-neutral-200 py-2 pr-3 pl-9 text-sm outline-none focus:border-neutral-400"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Поиск по имени файла..."
                  value={search}
                />
              </div>
            </form>
          </div>

          {message ? (
            <p className="text-sm text-neutral-600 whitespace-pre-line">{message}</p>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-500">
              {isPending ? "Загрузка..." : "Изображений пока нет. Загрузите первое."}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => {
                const isSelected = pendingId === item.id;
                return (
                  <button
                    className={cn(
                      "overflow-hidden rounded-lg border text-left transition-colors",
                      isSelected
                        ? "border-neutral-900 ring-1 ring-neutral-900"
                        : "border-neutral-200 hover:border-neutral-400",
                    )}
                    key={item.id}
                    onClick={() => setPendingId(item.id)}
                    type="button"
                  >
                    <div className="relative aspect-square overflow-hidden bg-neutral-100">
                      <CoverImage
                        alt={item.alt ?? item.filename}
                        sizes="160px"
                        src={item.url}
                      />
                    </div>
                    <div className="space-y-1 p-2.5">
                      <p className="truncate text-xs font-medium text-neutral-900">
                        {item.originalName}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {formatBytes(item.size)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <AdminButton
              disabled={isPending || page <= 1}
              onClick={() => loadItems(search, page - 1)}
              size="sm"
              type="button"
              variant="secondary"
            >
              Назад
            </AdminButton>
            <span className="text-xs text-neutral-500">
              {page} / {totalPages}
            </span>
            <AdminButton
              disabled={isPending || page >= totalPages}
              onClick={() => loadItems(search, page + 1)}
              size="sm"
              type="button"
              variant="secondary"
            >
              Далее
            </AdminButton>
          </div>

          <div className="flex gap-2">
            <AdminButton onClick={onClose} type="button" variant="secondary">
              Отмена
            </AdminButton>
            <AdminButton
              disabled={!pendingId || isPending}
              onClick={() => {
                const selected = items.find((item) => item.id === pendingId);
                if (selected) {
                  onSelect(selected);
                  onClose();
                }
              }}
              type="button"
            >
              Выбрать
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MediaPickerDialog({
  open,
  onClose,
  onSelect,
  selectedId,
  title,
}: MediaPickerDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <MediaPickerDialogContent
      key={selectedId ?? "empty"}
      onClose={onClose}
      onSelect={onSelect}
      selectedId={selectedId}
      title={title}
    />
  );
}
