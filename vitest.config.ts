import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Default to node env. Files needing the DOM should opt in with
    //   // @vitest-environment jsdom
    // at the top of the test file (next session will add jsdom dep).
    environment: "node",
  },
});
