"use client";

import { useRef, useTransition } from "react";
import { Upload } from "lucide-react";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import {
  MEDIA_UPLOAD_ACCEPT,
  uploadAdminMediaFile,
} from "@/components/admin/media/upload-admin-media-file";
import type { AdminMediaItem } from "@/types/admin-media";

type MediaUploadButtonProps = {
  label?: string;
  disabled?: boolean;
  onUploaded: (item: AdminMediaItem) => void;
  onError?: (message: string) => void;
  size?: "sm" | "md";
};

export function MediaUploadButton({
  label = "Загрузить фото",
  disabled = false,
  onUploaded,
  onError,
  size = "sm",
}: MediaUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    startTransition(async () => {
      const result = await uploadAdminMediaFile(file);
      if (result.success) {
        onUploaded(result.item);
      } else {
        onError?.(result.message);
      }
    });

    event.target.value = "";
  }

  return (
    <>
      <AdminButton
        disabled={disabled || isUploading}
        onClick={() => inputRef.current?.click()}
        size={size}
        type="button"
        variant="secondary"
      >
        <Upload className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
        {isUploading ? "Загрузка..." : label}
      </AdminButton>
      <input
        accept={MEDIA_UPLOAD_ACCEPT}
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleChange}
        ref={inputRef}
        type="file"
      />
    </>
  );
}
