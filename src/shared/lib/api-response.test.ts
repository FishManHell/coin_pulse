import { describe, it, expect } from "vitest";
import { apiError, ERRORS } from "./api-response";

describe("apiError", () => {
  it("returns a JSON NextResponse with the given message and status", async () => {
    const res = apiError("Invalid foo", 400);
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid foo" });
  });

  it("preserves arbitrary status codes (not constrained to a known set)", () => {
    expect(apiError("teapot", 418).status).toBe(418);
  });
});

describe("ERRORS shorthands", () => {
  it.each([
    ["unauthorized", 401, "Unauthorized"],
    ["forbidden", 403, "Forbidden"],
    ["notFound", 404, "Not found"],
    ["serverError", 500, "Server error"],
  ] as const)("ERRORS.%s emits %i with the canonical message", async (key, status, message) => {
    const res = ERRORS[key]();
    expect(res.status).toBe(status);
    await expect(res.json()).resolves.toEqual({ error: message });
  });
});
