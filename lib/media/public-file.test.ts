import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createPublicMediaResponse, readPublicMedia } from "./public-file";

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const imageName = "47cd1186-e16f-47a2-82f8-6b860f2447bc.png";

test("serves existing legacy /uploads URL files publicly with PNG MIME", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "roa-media-"));
  try {
    await mkdir(path.join(root, "admin"));
    await writeFile(path.join(root, "admin", imageName), png);

    const result = await readPublicMedia(root, ["admin", imageName]);
    assert.ok(result);
    assert.equal(result.contentType, "image/png");
    assert.deepEqual(result.body, png);
    assert.equal(result.cacheControl, "public, max-age=31536000, immutable");
    const head = createPublicMediaResponse("HEAD", result);
    assert.equal(head.status, 200);
    assert.equal(head.headers.get("Content-Type"), "image/png");
    assert.equal(head.headers.get("Content-Length"), String(png.length));
    assert.equal(await head.text(), "");
    const get = createPublicMediaResponse("GET", result);
    assert.deepEqual(Buffer.from(await get.arrayBuffer()), png);

    // A fresh handler read after simulated process restart still resolves the
    // file from the mounted upload directory; no in-memory index is required.
    const afterRestart = await readPublicMedia(root, ["admin", imageName]);
    assert.deepEqual(afterRestart?.body, await readFile(path.join(root, "admin", imageName)));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("rejects missing, traversal and unsupported media paths", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "roa-media-"));
  try {
    assert.equal(await readPublicMedia(root, ["admin", imageName]), null);
    assert.equal(await readPublicMedia(root, ["..", "secret.png"]), null);
    assert.equal(await readPublicMedia(root, ["admin", "secret.txt"]), null);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("rejects symlinks escaping the upload root", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "roa-media-root-"));
  const outside = await mkdtemp(path.join(os.tmpdir(), "roa-media-outside-"));
  try {
    await writeFile(path.join(outside, imageName), png);
    await symlink(outside, path.join(root, "admin"));
    assert.equal(await readPublicMedia(root, ["admin", imageName]), null);
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});
