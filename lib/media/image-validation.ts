const SIGNATURE_ERROR = "Файл не соответствует заявленному формату изображения.";

function asciiEquals(bytes: Uint8Array, offset: number, value: string): boolean {
  if (bytes.length < offset + value.length) {
    return false;
  }

  return [...value].every(
    (character, index) => bytes[offset + index] === character.charCodeAt(0),
  );
}

function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function isPng(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  );
}

function isWebp(bytes: Uint8Array): boolean {
  return asciiEquals(bytes, 0, "RIFF") && asciiEquals(bytes, 8, "WEBP");
}

function isAvif(bytes: Uint8Array): boolean {
  if (!asciiEquals(bytes, 4, "ftyp")) {
    return false;
  }

  if (asciiEquals(bytes, 8, "avif") || asciiEquals(bytes, 8, "avis")) {
    return true;
  }

  for (let offset = 16; offset + 4 <= Math.min(bytes.length, 256); offset += 4) {
    if (asciiEquals(bytes, offset, "avif") || asciiEquals(bytes, offset, "avis")) {
      return true;
    }
  }

  return false;
}

export function validateImageBuffer(
  buffer: Uint8Array,
  mimeType: string,
): string | null {
  const valid =
    (mimeType === "image/jpeg" && isJpeg(buffer)) ||
    (mimeType === "image/png" && isPng(buffer)) ||
    (mimeType === "image/webp" && isWebp(buffer)) ||
    (mimeType === "image/avif" && isAvif(buffer));

  return valid ? null : SIGNATURE_ERROR;
}
