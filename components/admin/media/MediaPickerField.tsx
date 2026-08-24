"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { CoverImage } from "@/components/ui/CoverImage";
import { CoverImageFrame } from "@/components/ui/CoverImageFrame";
import { MediaPickerDialog } from "@/components/admin/media/MediaPickerDialog";
import { MediaUploadButton } from "@/components/admin/media/MediaUploadButton";
import { formatBytes } from "@/components/admin/media/format-bytes";
import { cn } from "@/lib/utils/cn";
import { MEDIA_UPLOAD_HINT } from "@/lib/media/constants";
import type { AdminMediaItem, AdminMediaPickerValue } from "@/types/admin-media";

type MediaPickerFieldProps = {
  label: string;
  value: AdminMediaPickerValue;
  onChange: (value: AdminMediaPickerValue) => void;
  className?: string;
  aspectClassName?: string;
  allowRemove?: boolean;
  helperText?: string;
  uploadable?: boolean;
  uploadLabel?: string;
  libraryLabel?: string;
  disabled?: boolean;
};

export function MediaPickerField({
  label,
  value,
  onChange,
  className,
  aspectClassName = "aspect-[4/3]",
  allowRemove = true,
  helperText,
  uploadable = true,
  uploadLabel = "Загрузить фото",
  libraryLabel = "Выбрать из Media",
  disabled = false,
}: MediaPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSelect(item: AdminMediaItem) {
    setError(null);
    onChange(item);
  }

  function handleUpload(item: AdminMediaItem) {
    setError(null);
    onChange(item);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <p className="text-sm font-medium text-neutral-800">{label}</p>
        {helperText ? (
          <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
        <CoverImageFrame className={cn("max-w-xs bg-neutral-100", aspectClassName)}>
          {value ? (
            <CoverImage
              alt={value.alt ?? value.filename}
              sizes="240px"
              src={value.url}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-400">
              <ImageIcon className="h-8 w-8" strokeWidth={1.25} />
              <span className="text-xs">Изображение не выбрано</span>
            </div>
          )}
        </CoverImageFrame>

        {value ? (
          <div className="space-y-1 border-t border-neutral-200 px-3 py-2.5 text-xs text-neutral-600">
            <p className="truncate font-medium text-neutral-800">{value.originalName}</p>
            <p>{formatBytes(value.size)}</p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {uploadable ? (
          <MediaUploadButton
            disabled={disabled}
            label={uploadLabel}
            onError={setError}
            onUploaded={handleUpload}
          />
        ) : null}
        <AdminButton
          disabled={disabled}
          onClick={() => setOpen(true)}
          size="sm"
          type="button"
          variant="secondary"
        >
          {libraryLabel}
        </AdminButton>
        {allowRemove && value ? (
          <AdminButton
            disabled={disabled}
            onClick={() => {
              setError(null);
              onChange(null);
            }}
            size="sm"
            type="button"
            variant="danger"
          >
            Удалить
          </AdminButton>
        ) : null}
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <p className="text-xs text-neutral-500">{MEDIA_UPLOAD_HINT}</p>

      <MediaPickerDialog
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
        open={open}
        selectedId={value?.id ?? null}
        title={label}
      />
    </div>
  );
}
