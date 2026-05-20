import { describe, it, expect, vi, beforeEach } from "vitest";

let mod: typeof import("./global-translator");

beforeEach(async () => {
  vi.resetModules();
  mod = await import("./global-translator");
});

describe("translateGlobal", () => {
  it("returns the fallback when no translator is registered (pre-mount safety)", () => {
    expect(mod.translateGlobal("any.key", "fb")).toBe("fb");
  });

  it("delegates to the registered translator", () => {
    mod.setGlobalTranslator((key) => `T(${key})`);
    expect(mod.translateGlobal("a.b", "fb")).toBe("T(a.b)");
  });

  it("returns the fallback when the registered translator throws (missing key)", () => {
    mod.setGlobalTranslator(() => {
      throw new Error("MISSING_MESSAGE");
    });
    expect(mod.translateGlobal("a.b", "fb")).toBe("fb");
  });
});
