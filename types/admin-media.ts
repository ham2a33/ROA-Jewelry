export type AdminMediaItem = {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  alt: string | null;
};

export type AdminMediaPickerValue = AdminMediaItem | null;

export type ProductGalleryImage = {
  mediaId: string;
  url: string;
  filename: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
};
