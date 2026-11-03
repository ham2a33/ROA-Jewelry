import assert from "node:assert/strict";
import test from "node:test";
import { isSameOriginRequest } from "./origin";

test("accepts a same-origin request", () => {
  const request = new Request("https://roa-jewerly.com/api/admin/media/upload", {
    headers: { origin: "https://roa-jewerly.com" },
  });

  assert.equal(isSameOriginRequest(request), true);
});

test("accepts public HTTPS origin behind an HTTP reverse proxy", () => {
  const request = new Request("http://roa-app:3000/api/admin/media/upload", {
    headers: {
      origin: "https://roa-jewerly.com",
      host: "roa-app:3000",
      "x-forwarded-host": "roa-jewerly.com",
      "x-forwarded-proto": "https",
    },
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
