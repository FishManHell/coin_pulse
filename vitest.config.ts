import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Default to node env. Files needing the DOM opt in with
    //   // @vitest-environment jsdom
    // at the top of the test file.
    environment: "node",
  },
});
