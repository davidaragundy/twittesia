import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      // Autofixing, so it never blocks anyone: import order belongs to
      // formatting rather than to validation. Relative imports have no group
      // because the conventions do not allow them.
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"],
            ["^node:"],
            ["^@?\\w"],
            ["^@/shared"],
            ["^@/features"],
            ["^@/"],
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
  // Default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
