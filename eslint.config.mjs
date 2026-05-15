import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Newer react-hooks rule is overly strict for legitimate patterns
      // (one-time store hydration, intentional effect separation, fetch effects).
      // Keep as a warning for visibility; refactor real anti-patterns case-by-case.
      "react-hooks/set-state-in-effect": "warn",
      // The only image use in this app is small (32–40px) SVG coin icons served
      // from a CDN. next/image passes SVGs through unoptimized and would only
      // add remotePatterns ceremony without any LCP/bandwidth benefit.
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
