import assert from "node:assert/strict";
import test from "node:test";
import { validateImageBuffer } from "./image-validation";

test("accepts supported image signatures", () => {
  assert.equal(
    validateImageBuffer(
      Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]),
      "image/jpeg",
    ),
    null,
  );
  assert.equal(
    validateImageBuffer(
      Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      "image/png",
    ),
    null,
  );
  assert.equal(
    validateImageBuffer(
      Uint8Array.from([...Buffer.from("RIFF"), 0, 0, 0, 0, ...Buffer.from("WEBP")]),
      "image/webp",
    ),
    null,
  );
  assert.equal(
    validateImageBuffer(
      Uint8Array.from([...Buffer.from("xxxxftypavif")]),
      "image/avif",
    ),
    null,
  );
});

test("rejects a file whose bytes do not match its MIME type", () => {
  assert.match(
    validateImageBuffer(Uint8Array.from(Buffer.from("not an image")), "image/png") ?? "",
    /формату изображения/i,
  );
});
