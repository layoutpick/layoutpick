import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // ── Design-system lockdown ──────────────────────────────────────────────
  // App code may compose ONLY design-system components. Native HTML elements,
  // inline styles, and literal/arbitrary color values are forbidden here.
  {
    files: ["src/app/**/*.tsx", "src/components/**/*.tsx"],
    ignores: [
      "src/components/ui/**",
      "src/components/brand/**",
      "src/app/layout.tsx",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name=/^[a-z]/]",
          message:
            "No native HTML in app code. Use a design-system component (Container/Section/Stack/Row/Box, Heading/Text, Link, Button/Card/Badge/Separator) or next/image + lucide-react.",
        },
        {
          selector: "JSXAttribute[name.name='style']",
          message: "No inline styles. Use token utility classes (bg-surface, text-accent, gap-md, rounded-token-md, …).",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\[|#[0-9a-fA-F]{3,8}\\b|rgba?\\(/]",
          message: "No arbitrary values or literal colors in className. Use design tokens.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] TemplateElement[value.raw=/\\[|#[0-9a-fA-F]{3,8}\\b|rgba?\\(/]",
          message: "No arbitrary values or literal colors in className. Use design tokens.",
        },
      ],
    },
  },
]);

export default eslintConfig;
