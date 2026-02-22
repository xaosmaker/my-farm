import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import conf from "./esl.boundaries.json" with { type: "json" };

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          // args: "all",
          argsIgnorePattern: "^_",
          // caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          //ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    plugins: { boundaries: boundaries },
    ...conf,
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
