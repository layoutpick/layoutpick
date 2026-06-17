// Canonical design tokens — the single source of truth. globals.css @theme is
// generated from this file via scripts/gen-theme.mjs (npm run gen:theme).
export const tokens = {
  color: {
    bg: "#0d0f14",
    surface: "#13161d",
    surface2: "#1a1e28",
    text: "#e7e9ee",
    textMuted: "#7b8299",
    accent: "#4c8dff",
    accent2: "#38c9b0",
    border: "#252a36",
  },
  type: {
    display: { size: "3.25rem", lineHeight: "1.05", weight: "600" },
    h1: { size: "2.25rem", lineHeight: "1.1", weight: "600" },
    h2: { size: "1.5rem", lineHeight: "1.2", weight: "600" },
    h3: { size: "1.125rem", lineHeight: "1.3", weight: "600" },
    body: { size: "1rem", lineHeight: "1.6", weight: "400" },
    small: { size: "0.875rem", lineHeight: "1.5", weight: "400" },
    mono: { size: "0.875rem", lineHeight: "1.5", weight: "400" },
  },
  space: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "40px", "2xl": "64px", "3xl": "96px" },
  radius: { sm: "6px", md: "10px", lg: "16px", full: "9999px" },
  font: {
    sans: "var(--font-inter), system-ui, -apple-system, sans-serif",
    mono: "var(--font-jetbrains-mono), ui-monospace, monospace",
  },
} as const

export type Tokens = typeof tokens
