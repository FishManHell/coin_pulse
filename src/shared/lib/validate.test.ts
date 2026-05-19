import { describe, it, expect } from "vitest";
import { requireString } from "./validate";

describe("requireString", () => {
  it("returns null when the value is absent (undefined) — PATCH-style optional", () => {
    expect(requireString(undefined)).toBeNull();
  });

  it("returns null when the value is a string — accepts empty strings (presence is route-specific)", () => {
    expect(requireString("alice")).toBeNull();
    expect(requireString("")).toBeNull();
  });

  it("returns a 400 error response with the generic invalid-field code when the value is not a string", async () => {
    const res = requireString(42);
    expect(res).not.toBeNull();
    expect(res?.status).toBe(400);
    await expect(res?.json()).resolves.toEqual({ error: "common.invalidField" });
  });

  it("rejects null (typeof null === 'object', not 'string')", () => {
    const res = requireString(null);
    expect(res?.status).toBe(400);
  });

  it("rejects arrays and objects", () => {
    expect(requireString([])?.status).toBe(400);
    expect(requireString({})?.status).toBe(400);
  });
});
