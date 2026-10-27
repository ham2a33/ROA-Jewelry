import assert from "node:assert/strict";
import test from "node:test";
import { isSameOriginRequest } from "./origin";

test("accepts a same-origin request", () => {
  const request = new Request("https://roa-jewerly.com/api/admin/media/upload", {
    headers: { origin: "https://roa-jewerly.com" },
  });

  assert.equal(isSameOriginRequest(request), true);
});

test("rejects missing or foreign origins", () => {
  const missingOrigin = new Request(
    "https://roa-jewerly.com/api/admin/media/upload",
  );
  const foreignOrigin = new Request(
    "https://roa-jewerly.com/api/admin/media/upload",
    { headers: { origin: "https://attacker.example" } },
  );

  assert.equal(isSameOriginRequest(missingOrigin), false);
  assert.equal(isSameOriginRequest(foreignOrigin), false);
});
