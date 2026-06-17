# Design-System Lockdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use `- [ ]`.

**Goal:** Convert the `web/` Next.js app into a locked-down design system — token source of truth, thin brand primitives + shadcn, a `/brand` catalog, and maximal ESLint rules forbidding native HTML / inline styles / literal colors in app code.

**Architecture:** `src/lib/tokens.ts` is the canonical token source; `scripts/gen-theme.mjs` generates a matching Tailwind v4 `@theme` block in `globals.css`. App code composes only `src/components/brand/*` primitives + `src/components/ui/*` (shadcn) + `next/*`. ESLint forbids lowercase JSX elements, inline `style`, and arbitrary/literal color values everywhere except the primitive-definition dirs.

**Tech Stack:** Next.js 16 (App Router), Tailwind v4, shadcn/ui (base-nova, lucide), TypeScript, flat ESLint (`eslint.config.mjs`).

## Global Constraints

- App is **dark-only**; aesthetic preserved: bg `#0d0f14`, accent `#4c8dff`, accent2 `#38c9b0`, muted text `#7b8299`. Fonts: Inter (sans), JetBrains Mono (mono).
- **No new ESLint dependencies** — enforcement is pure `no-restricted-syntax` + the existing `eslint-config-next`.
- Work only in `web/`; do **not** touch `host/` or `extension/`.
- All paths below are relative to `/Users/simaonogueira/Developer/layoutpick/web`.
- Verification gates are **`npm run build`** and **`npx eslint .`** (this app has no unit-test harness); plus the explicit "rules bite" proof in Task 8.
- Commit after each task. Run all commands from `web/`.

---

### Task 1: Token source + theme generator + dark theme

**Files:**
- Create: `src/lib/tokens.ts`
- Create: `scripts/gen-theme.mjs`
- Modify: `src/app/globals.css` (add generated token block + dark defaults + font vars)
- Modify: `package.json` (add `gen:theme` script)

**Interfaces:**
- Produces: `tokens` object (default + named export) with keys `color`, `type`, `space`, `radius`, `font`; consumed by primitives (Tasks 2–4) and the `/brand` page (Task 6).

- [ ] **Step 1: Create `src/lib/tokens.ts`**

```typescript
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
```

- [ ] **Step 2: Create `scripts/gen-theme.mjs`**

```javascript
// Generate the @theme token block in globals.css from src/lib/tokens.ts.
// Rewrites the region between the BEGIN/END markers so tokens never drift.
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const mod = await import(join(root, "src/lib/tokens.ts"))
const t = mod.tokens

const lines = ["@theme {"]
for (const [k, v] of Object.entries(t.color)) lines.push(`  --color-${kebab(k)}: ${v};`)
for (const [k, v] of Object.entries(t.type)) lines.push(`  --text-${kebab(k)}: ${v.size};`)
for (const [k, v] of Object.entries(t.space)) lines.push(`  --spacing-${k}: ${v};`)
for (const [k, v] of Object.entries(t.radius)) lines.push(`  --radius-token-${k}: ${v};`)
lines.push(`  --font-sans: ${t.font.sans};`)
lines.push(`  --font-mono: ${t.font.mono};`)
lines.push("}")

function kebab(s) { return s.replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase() }

const css = readFileSync(join(root, "src/app/globals.css"), "utf8")
const BEGIN = "/* BEGIN GENERATED TOKENS */"
const END = "/* END GENERATED TOKENS */"
const block = `${BEGIN}\n${lines.join("\n")}\n${END}`
const re = new RegExp(`${escape(BEGIN)}[\\s\\S]*?${escape(END)}`)
const next = re.test(css) ? css.replace(re, block) : `${block}\n\n${css}`
function escape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }
writeFileSync(join(root, "src/app/globals.css"), next)
console.log("globals.css @theme regenerated from tokens.ts")
```

(Bun/Node 22 can import a `.ts` file directly when run via `bun scripts/gen-theme.mjs`; if running with plain `node`, run it with `bun` — see the script wiring in Step 4.)

- [ ] **Step 3: Add the marker block + dark defaults + font vars to `src/app/globals.css`**

Immediately after the existing `@import` lines at the top, insert the empty marker pair (the generator fills it):

```css
/* BEGIN GENERATED TOKENS */
/* END GENERATED TOKENS */
```

Then ensure the app renders dark by default and wires the brand semantic colors onto shadcn's variables. Replace the `:root { --background: #0d0f14; ... }` light values with a dark palette and force dark globally — add at the END of `globals.css`:

```css
:root {
  color-scheme: dark;
  --background: var(--color-bg);
  --foreground: var(--color-text);
  --card: var(--color-surface);
  --card-foreground: var(--color-text);
  --popover: var(--color-surface);
  --popover-foreground: var(--color-text);
  --primary: var(--color-accent);
  --primary-foreground: #08121f;
  --secondary: var(--color-surface2);
  --secondary-foreground: var(--color-text);
  --muted: var(--color-surface2);
  --muted-foreground: var(--color-text-muted);
  --accent: var(--color-surface2);
  --accent-foreground: var(--color-text);
  --border: var(--color-border);
  --input: var(--color-border);
  --ring: var(--color-accent);
  --radius: 0.625rem;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}
```

- [ ] **Step 4: Add the `gen:theme` script to `package.json`**

In `"scripts"`, add (Bun is installed and runs `.ts` imports natively):

```json
"gen:theme": "bun scripts/gen-theme.mjs"
```

- [ ] **Step 5: Generate + verify the build**

Run: `npm run gen:theme`
Expected: prints "globals.css @theme regenerated from tokens.ts"; the marker block now contains `--color-accent: #4c8dff;`, `--text-h1: 2.25rem;`, etc.

Run: `npm run build`
Expected: builds with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/tokens.ts scripts/gen-theme.mjs src/app/globals.css package.json
git commit -m "feat(web): design tokens + @theme generator + dark theme"
```

---

### Task 2: Brand primitives — Heading + Text

**Files:**
- Create: `src/components/brand/typography.tsx`

**Interfaces:**
- Consumes: token utility classes from Task 1 (`text-accent`, `text-text-muted`, `font-mono`, …).
- Produces: `Heading` (`{ level: 1 | 2 | 3, as?, className?, children }`), `Text` (`{ variant?: 'body' | 'small' | 'mono', muted?: boolean, as?, className?, children }`). Used by Tasks 6 and 7.

- [ ] **Step 1: Implement `src/components/brand/typography.tsx`**

```tsx
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

const HEADING_CLASS: Record<1 | 2 | 3, string> = {
  1: "text-h1 font-semibold leading-tight tracking-tight text-text",
  2: "text-h2 font-semibold leading-snug text-text",
  3: "text-h3 font-semibold text-text",
}

export function Heading({
  level,
  as,
  className,
  children,
}: {
  level: 1 | 2 | 3
  as?: "h1" | "h2" | "h3" | "h4"
  className?: string
  children: ReactNode
}) {
  const Tag = as ?? (`h${level}` as const)
  return <Tag className={cn(HEADING_CLASS[level], className)}>{children}</Tag>
}

const TEXT_CLASS = {
  body: "text-body text-text",
  small: "text-small text-text",
  mono: "text-mono font-mono text-text",
} as const

export function Text({
  variant = "body",
  muted = false,
  as: Tag = "p",
  className,
  children,
}: {
  variant?: "body" | "small" | "mono"
  muted?: boolean
  as?: "p" | "span" | "div"
  className?: string
  children: ReactNode
}) {
  return (
    <Tag className={cn(TEXT_CLASS[variant], muted && "text-text-muted", className)}>
      {children}
    </Tag>
  )
}
```

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: compiles (these files are exempt from the lockdown, which isn't enabled until Task 8).

- [ ] **Step 3: Commit**

```bash
git add src/components/brand/typography.tsx
git commit -m "feat(web): Heading + Text brand primitives"
```

---

### Task 3: Brand primitive — Link

**Files:**
- Create: `src/components/brand/link.tsx`

**Interfaces:**
- Produces: `Link` — all `next/link` `LinkProps` plus `{ variant?: 'nav' | 'inline' | 'muted', className?, children }`. Used by Tasks 6, 7.

- [ ] **Step 1: Implement `src/components/brand/link.tsx`**

```tsx
import NextLink, { type LinkProps } from "next/link"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

const VARIANT = {
  nav: "text-small text-text-muted hover:text-text transition-colors no-underline",
  inline: "text-accent hover:underline underline-offset-4",
  muted: "text-text-muted hover:text-text transition-colors no-underline",
} as const

export function Link({
  variant = "inline",
  className,
  children,
  ...props
}: LinkProps & {
  variant?: "nav" | "inline" | "muted"
  className?: string
  children: ReactNode
  target?: string
  rel?: string
}) {
  return (
    <NextLink className={cn(VARIANT[variant], className)} {...props}>
      {children}
    </NextLink>
  )
}
```

- [ ] **Step 2: Build check** — Run: `npm run build` — Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add src/components/brand/link.tsx
git commit -m "feat(web): Link brand primitive"
```

---

### Task 4: Brand primitives — layout (Container, Section, Stack, Row, Box)

**Files:**
- Create: `src/components/brand/layout.tsx`

**Interfaces:**
- Produces: `Container`, `Section`, `Stack`, `Row`, `Box` (all `{ className?, children, id? }`; `Stack`/`Row` also `{ gap?: keyof spaceScale, align?, justify? }`). Used by Tasks 6, 7.

- [ ] **Step 1: Implement `src/components/brand/layout.tsx`**

```tsx
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type Base = { className?: string; children: ReactNode; id?: string }
type Gap = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"

const GAP: Record<Gap, string> = {
  xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-10", "2xl": "gap-16", "3xl": "gap-24",
}

export function Container({ className, children, id }: Base) {
  return <div id={id} className={cn("w-full max-w-[740px] mx-auto px-6", className)}>{children}</div>
}

export function Section({ className, children, id }: Base) {
  return <section id={id} className={cn("py-16", className)}>{children}</section>
}

export function Stack({
  gap = "md", align, justify, className, children, id,
}: Base & { gap?: Gap; align?: "start" | "center" | "end"; justify?: "start" | "center" | "between" }) {
  return (
    <div
      id={id}
      className={cn(
        "flex flex-col", GAP[gap],
        align && { start: "items-start", center: "items-center", end: "items-end" }[align],
        justify && { start: "justify-start", center: "justify-center", between: "justify-between" }[justify],
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Row({
  gap = "md", align = "center", justify, className, children, id,
}: Base & { gap?: Gap; align?: "start" | "center" | "end"; justify?: "start" | "center" | "between" }) {
  return (
    <div
      id={id}
      className={cn(
        "flex flex-row flex-wrap", GAP[gap],
        { start: "items-start", center: "items-center", end: "items-end" }[align],
        justify && { start: "justify-start", center: "justify-center", between: "justify-between" }[justify],
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Box({ className, children, id }: Base) {
  return <div id={id} className={cn(className)}>{children}</div>
}
```

- [ ] **Step 2: Build check** — Run: `npm run build` — Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add src/components/brand/layout.tsx
git commit -m "feat(web): layout brand primitives"
```

---

### Task 5: Add shadcn Badge + Separator

**Files:**
- Create: `src/components/ui/badge.tsx`, `src/components/ui/separator.tsx` (via shadcn CLI)

- [ ] **Step 1: Add components**

Run: `npx --yes shadcn@latest add badge separator --yes`
Expected: creates `src/components/ui/badge.tsx` and `src/components/ui/separator.tsx`. If `separator` pulls a peer dep, accept it.

- [ ] **Step 2: Build check** — Run: `npm run build` — Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/badge.tsx src/components/ui/separator.tsx package.json bun.lock
git commit -m "feat(web): add shadcn badge + separator"
```

---

### Task 6: `/brand` catalog page

**Files:**
- Create: `src/app/brand/page.tsx`

**Interfaces:**
- Consumes: `tokens` (Task 1), `Heading`/`Text` (Task 2), `Link` (Task 3), layout primitives (Task 4), `Button`/`Card`/`Badge`/`Separator` (Task 5 + existing).

- [ ] **Step 1: Implement `src/app/brand/page.tsx`** — render the system from tokens + components. It must itself obey the lockdown (compose only primitives + ui).

All class strings are STATIC (via lookup maps) — Tailwind v4 only generates
utilities it can see literally, and the lockdown forbids interpolated/arbitrary
classes. The `SWATCH` and `TYPE_CLASS` maps below provide the static classes.

```tsx
import { tokens } from "@/lib/tokens"
import { Container, Section, Stack, Row, Box } from "@/components/brand/layout"
import { Heading, Text } from "@/components/brand/typography"
import { Link } from "@/components/brand/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Static class maps — keys mirror tokens.color / tokens.type.
const SWATCH: Record<keyof typeof tokens.color, string> = {
  bg: "bg-bg", surface: "bg-surface", surface2: "bg-surface2", text: "bg-text",
  textMuted: "bg-text-muted", accent: "bg-accent", accent2: "bg-accent2", border: "bg-border",
}
const TYPE_CLASS: Record<keyof typeof tokens.type, string> = {
  display: "text-display font-semibold", h1: "text-h1 font-semibold", h2: "text-h2 font-semibold",
  h3: "text-h3 font-semibold", body: "text-body", small: "text-small", mono: "text-mono font-mono",
}

export default function BrandPage() {
  return (
    <Container className="max-w-screen-md">
      <Section>
        <Stack gap="xl">
          <Stack gap="sm">
            <Heading level={1}>LayoutPick design system</Heading>
            <Text muted>Every token and component the app is allowed to use.</Text>
          </Stack>

          {/* Colors */}
          <Stack gap="md">
            <Heading level={2}>Color</Heading>
            <Row gap="md">
              {(Object.keys(tokens.color) as (keyof typeof tokens.color)[]).map((name) => (
                <Card key={name} className="p-3 w-40">
                  <Stack gap="sm">
                    <Box className={`h-12 rounded-token-md border border-border ${SWATCH[name]}`} />
                    <Text variant="small">{name}</Text>
                    <Text variant="mono" muted>{tokens.color[name]}</Text>
                  </Stack>
                </Card>
              ))}
            </Row>
          </Stack>

          <Separator />

          {/* Type scale */}
          <Stack gap="md">
            <Heading level={2}>Type scale</Heading>
            {(Object.keys(tokens.type) as (keyof typeof tokens.type)[]).map((step) => (
              <Row key={step} gap="lg" justify="between">
                <Text as="span" className={TYPE_CLASS[step]}>The quick brown fox</Text>
                <Text variant="mono" muted>{step} · {tokens.type[step].size}</Text>
              </Row>
            ))}
          </Stack>

          <Separator />

          {/* Components */}
          <Stack gap="md">
            <Heading level={2}>Components</Heading>
            <Row gap="md">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </Row>
            <Row gap="md">
              <Badge>Badge</Badge>
              <Link variant="inline" href="#">Inline link</Link>
              <Link variant="nav" href="#">Nav link</Link>
            </Row>
            <Card className="p-5 max-w-sm">
              <Stack gap="sm">
                <Heading level={3}>Card title</Heading>
                <Text muted>Cards, badges, separators, links — all themed from tokens.</Text>
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </Section>
    </Container>
  )
}
```

(Note: the `${SWATCH[name]}` interpolation appends a *static* class from the map — no `[`/hex/arbitrary value — so it passes both Tailwind detection and the lockdown's className rule. The whole file uses only token utilities, fixed widths via named scale (`w-40`, `max-w-sm`, `max-w-screen-md`), and no inline `style`.)

- [ ] **Step 2: Build + visual check**

Run: `npm run build`
Expected: `/brand` appears in the route list and builds.

- [ ] **Step 3: Commit**

```bash
git add src/app/brand/page.tsx
git commit -m "feat(web): /brand catalog page"
```

---

### Task 7: Convert layout.tsx, page.tsx, CopyCommand.tsx to the system

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/CopyCommand.tsx`

**Conversion rules (apply to all three):**
- Replace every native content/interactive element with a primitive: `<a>`→`Link`, `<button>`→`Button` (shadcn), `<h*>`→`Heading`, `<p>/<span>` text→`Text`, `<img>`→`next/image`, `<svg>`→a `lucide-react` icon, structural `<div>/<section>`→`Box`/`Stack`/`Row`/`Container`/`Section`.
- Remove ALL `style={{}}` — express via token utility classes (`bg-bg`, `text-text-muted`, `text-accent`, `gap-*`, `rounded-token-md`, etc.).
- Remove ALL literal hex/rgb and arbitrary `[...]` Tailwind values — use token utilities only.
- `layout.tsx` keeps `<html>`/`<body>` (exempt) but its `<body>` must drop the inline `style` (font now comes from the `body{}` rule added in Task 1).

- [ ] **Step 1: Convert `layout.tsx`** — remove the `style={{ fontFamily }}` from `<body>` (Task 1's `globals.css` `body{}` sets the font); keep the font `variable` classes on `<html>`.

- [ ] **Step 2: Convert `CopyCommand.tsx`** — keep `"use client"`; replace its wrapper/markup with `Row`/`Box`/`Text`/`Button` (shadcn `Button variant="ghost" size="icon"` for the copy button, a `lucide-react` `Copy`/`Check` icon), token classes only, no inline style.

- [ ] **Step 3: Convert `page.tsx`** — read the current file for the exact copy (hero tagline, the 3 how-it-works steps, the `curl -fsSL https://layoutpick.com/install.sh | sh` command, usage steps, footer, the Web Store placeholder link `https://chromewebstore.google.com/`). Reproduce every section composing only `Container`/`Section`/`Stack`/`Row`/`Box`/`Heading`/`Text`/`Link`/`Button`/`Card`/`Badge`/`Separator` + `CopyCommand`. Preserve copy verbatim and the visual hierarchy. The accent word "Claude Code" uses `<Text as="span" className="text-accent">`. No inline styles, no literal colors.

- [ ] **Step 4: Build + lint (pre-lockdown) check**

Run: `npm run build`
Expected: builds, `/` and `/brand` present.
Run: `npx eslint .`
Expected: passes (lockdown not yet enabled — this confirms no pre-existing errors).

- [ ] **Step 5: Grep self-check** — confirm no violations remain in app code:

Run: `grep -rnE "style=\{\{|#[0-9a-fA-F]{3,8}|className=\"[^\"]*\[" src/app src/components/CopyCommand.tsx`
Expected: no output (empty).

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx src/components/CopyCommand.tsx
git commit -m "feat(web): convert app to design-system primitives"
```

---

### Task 8: Enable maximal-lockdown ESLint + prove it bites

**Files:**
- Modify: `eslint.config.mjs`

**Interfaces:**
- Consumes: the converted app (Task 7) — must pass clean once the rules turn on.

- [ ] **Step 1: Add the lockdown overrides to `eslint.config.mjs`**

Append, before the closing `]` of `defineConfig([...])`, after the existing entries:

```javascript
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
```

- [ ] **Step 2: Run lint — must be clean**

Run: `npx eslint .`
Expected: **no errors** (Task 7 already removed all violations from app code; primitives/layout/ui are exempt).
If errors appear, fix the offending app-code line (convert to a primitive / token class) until clean. Do NOT widen the exempt list to silence them.

- [ ] **Step 3: Prove the rules bite (then revert)**

Temporarily edit `src/app/page.tsx`: add near the top of the returned JSX a line `<a href="#" style={{ color: "#fff" }} className="bg-[#fff]">x</a>`.
Run: `npx eslint src/app/page.tsx`
Expected: THREE errors fire — native element (`<a>`), inline `style`, and arbitrary/literal className.
Then **remove** that line. Re-run `npx eslint .` → clean. (Document this result in the commit message body.)

- [ ] **Step 4: Final build**

Run: `npm run build`
Expected: builds clean.

- [ ] **Step 5: Commit**

```bash
git add eslint.config.mjs
git commit -m "feat(web): maximal-lockdown eslint (no native HTML / inline style / literal colors)

Verified the rules fire on a raw <a>, inline style, and bg-[#fff] before reverting the probe."
```

---

## Notes for the implementer
- **tokens.ts is the source of truth.** To change any token, edit `tokens.ts` then `npm run gen:theme`; never hand-edit the generated block in `globals.css`.
- The lockdown applies to *consumers*. The primitive definitions in `components/brand` + `components/ui` and `app/layout.tsx` (needs `<html>/<body>`) are exempt — that is where native elements legitimately live.
- "Token-only" is enforced by banning arbitrary values + literal colors, NOT by enumerating allowed classes (out of scope per spec).
- Preserve the existing dark `#0d0f14` / `#4c8dff` look — this is a structural conversion, not a redesign.
