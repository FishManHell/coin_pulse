import { describe, it, expect } from "vitest";
import { apiError, ERRORS } from "./api-response";

describe("apiError", () => {
  it("returns a JSON NextResponse with the given code and status", async () => {
    const res = apiError("auth.emailTaken", 400);
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "auth.emailTaken" });
  });

  it("preserves arbitrary status codes (not constrained to a known set)", () => {
    expect(apiError("debug.teapot", 418).status).toBe(418);
  });
});

describe("ERRORS shorthands", () => {
  it.each([
    ["unauthorized", 401, "common.unauthorized"],
    ["forbidden", 403, "common.forbidden"],
    ["notFound", 404, "common.notFound"],
    ["serverError", 500, "common.serverError"],
  ] as const)("ERRORS.%s emits %i with the canonical code", async (key, status, code) => {
    const res = ERRORS[key]();
    expect(res.status).toBe(status);
    await expect(res.json()).resolves.toEqual({ error: code });
  });
});
