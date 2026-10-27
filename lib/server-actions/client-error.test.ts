import assert from "node:assert/strict";
import test from "node:test";
import {
  formatServerActionClientError,
  STALE_DEPLOYMENT_MESSAGE,
} from "./client-error";

test("formatServerActionClientError detects stale Server Action deployment", () => {
  const message = formatServerActionClientError(
    new Error(
      "Failed to find Server Action. This request might be from an older or newer deployment.",
    ),
  );
  assert.equal(message, STALE_DEPLOYMENT_MESSAGE);
});

test("formatServerActionClientError detects body size limit errors", () => {
  const message = formatServerActionClientError(
    new Error("Body exceeded 1 MB limit."),
  );
  assert.match(message, /слишком больш/i);
});

test("formatServerActionClientError detects invalid Server Reference ID", () => {
  const message = formatServerActionClientError(
    new Error("The Server Reference ID did not match the expected format."),
  );
  assert.equal(message, STALE_DEPLOYMENT_MESSAGE);
});

test("formatServerActionClientError does not expose unknown server details", () => {
  const message = formatServerActionClientError(
    new Error("Prisma connection failed: postgresql://secret@example/db"),
  );

  assert.equal(
    message,
    "Не удалось выполнить действие. Проверьте соединение и попробуйте снова.",
  );
  assert.doesNotMatch(message, /secret|postgresql/i);
});
