import { describe, it, expect } from "vitest";
import { requireString } from "./validate";

describe("requireString", () => {
  it("returns null when the value is absent (undefined) — PATCH-style optional", () => {
    expect(requireString(undefined, "name")).toBeNull();
  });

  it("returns null when the value is a string — accepts empty strings (presence is route-specific)", () => {
    expect(requireString("alice", "name")).toBeNull();
    expect(requireString("", "name")).toBeNull();
  });

  it("returns a 400 error response with the field name when the value is not a string", async () => {
    const res = requireString(42, "name");
    expect(res).not.toBeNull();
    expect(res?.status).toBe(400);
    await expect(res?.json()).resolves.toEqual({ error: "Invalid name" });
  });

  it("rejects null (typeof null === 'object', not 'string')", () => {
    const res = requireString(null, "name");
    expect(res?.status).toBe(400);
  });

  it("rejects arrays and objects", () => {
    expect(requireString([], "name")?.status).toBe(400);
    expect(requireString({}, "name")?.status).toBe(400);
  });
});
