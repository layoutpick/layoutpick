# LayoutPick web — design-system lockdown

**Date:** 2026-06-17
**Status:** approved (brainstorming) — pending spec review
**App:** `web/` (Next.js 16, App Router, Tailwind v4, shadcn/ui)

## Goal

Turn the `web/` landing app into a locked-down design system:

1. **Convert** every page/component to compose only design-system components —
   shadcn primitives (Button, Card, …) and Next.js components (`next/link`,
   `next/image`) — with zero inline styles, native HTML, or literal colors.
2. **`/brand`** page = the living catalog AND the single source of truth for
   tokens: it renders every token (color, type, spacing, radii) and every
   component variant.
3. **Maximal-lockdown ESLint** rules that force all app code to use only the
   design system.

Today `src/app/page.tsx` is built with inline `style={{}}`, hardcoded hex
(`#4c8dff`, `#7b8299`, `#0d0f14`), and raw `<a>` tags — none of the system. This
rewrite eliminates that and prevents its return.

## Architecture (layers)

```
src/lib/tokens.ts          canonical tokens (TS objects): color, type scale,
                           spacing, radii, fonts. Single source of truth.
src/app/globals.css @theme Tailwind v4 CSS variables, generated to MATCH
                           tokens.ts (kept in lockstep — see Tokens below).
src/components/ui/*        shadcn: button, card, badge, separator.
src/components/brand/*     thin brand primitives — the ONLY content/layout
                           elements app code may use:
                             Link        (wraps next/link + brand styles)
                             Heading     (type-scale headings)
                             Text        (body/small/mono text)
                             Container   (max-width page gutter)
                             Section     (vertical rhythm wrapper)
                             Stack       (flex column, token gap)
                             Row         (flex row, token gap)
                             Box         (generic styled div escape hatch)
src/app/**                 pages compose ONLY ui + brand primitives.
src/app/brand/page.tsx     living catalog (imports tokens.ts + components).
```

Each primitive has one job, a typed prop API, and wraps exactly one native
element internally. App code never reaches past these.

## Tokens

`src/lib/tokens.ts` exports typed objects:

- **color** — semantic keys → values:
  `bg` (#0d0f14), `surface`, `surface2`, `text`, `textMuted` (#7b8299),
  `accent` (#4c8dff), `accent2` (#38c9b0), `border`.
- **type** — named steps with `{ size, lineHeight, weight }`:
  `display`, `h1`, `h2`, `h3`, `body`, `small`, `mono`.
- **space** — named scale (e.g. `xs…3xl`).
- **radius** — `sm`, `md`, `lg`, `full`.
- **font** — `sans` (Inter), `mono` (JetBrains Mono).

`globals.css` contains a `@theme` block exposing the same values as Tailwind v4
variables (`--color-accent`, `--color-surface`, `--text-h1`, `--radius-md`, …),
so token utility classes (`text-accent`, `bg-surface`, `rounded-md`) exist.

**Lockstep:** a small script `scripts/gen-theme.mjs` generates the `@theme` block
from `tokens.ts`; `globals.css` has clearly-marked BEGIN/END GENERATED markers it
rewrites. Run as `npm run gen:theme` (and documented as the way to change a
token). This prevents tokens.ts ↔ CSS drift.

## Brand primitives (API sketch)

- `Link` — props of `next/link` plus `variant?: 'nav' | 'inline' | 'muted'`.
  Renders `<NextLink>` with token classes.
- `Heading` — `level: 1|2|3`, `as?` override; maps to the type scale.
- `Text` — `variant?: 'body' | 'small' | 'mono'`, `muted?: boolean`.
- `Container` — centered, max-width, horizontal gutter.
- `Section` — `<section>` with token vertical padding.
- `Stack` / `Row` — flex column/row with `gap` from the space scale, alignment props.
- `Box` — styled `div` accepting only token-driven className (escape hatch for
  one-off layout; still subject to the no-arbitrary-values rule).

shadcn `Button`, `Card`, `Badge`, `Separator` are used as-is (their theme comes
from the CSS variables).

## ESLint — maximal lockdown

Flat config `eslint.config.mjs`, extending `eslint-config-next`, with scoped
overrides. **No new lint dependencies** — pure `no-restricted-syntax`.

**Strict zone** — `src/app/**` and `src/components/**` EXCEPT the exempt zone:

1. **No native HTML elements.** Any lowercase JSX opening element is an error:
   `no-restricted-syntax` on `JSXOpeningElement[name.name=/^[a-z]/]` with a
   message naming the replacement (use a design-system component). This is the
   rule that enforces "compose only the system."
2. **No inline styles.** `no-restricted-syntax` on
   `JSXAttribute[name.name='style']`.
3. **No literal colors / arbitrary Tailwind values.** `no-restricted-syntax` on
   `Literal`/`TemplateElement` whose value matches `/\[|#[0-9a-fA-F]{3,8}\b|rg(b|ba)\(/`
   inside `className` — bans `bg-[#fff]`, `w-[13px]`, `#0d0f14`, `rgb(...)`.

**Exempt zone** — native elements allowed (this is where primitives are defined):
`src/components/ui/**`, `src/components/brand/**`, and `src/app/layout.tsx`
(needs `<html>`/`<body>`). The arbitrary-value/color ban also relaxes here only
as needed for the primitive implementations.

**Boundary (explicit, by design):** "token-only" is enforced by banning arbitrary
values + literal colors, NOT by enumerating an allowlist of permitted Tailwind
classes (there are thousands of legitimate token utilities). A finite class
allowlist is intentionally OUT OF SCOPE — it would be brittle and unmaintainable.

## /brand catalog

`src/app/brand/page.tsx` imports `tokens.ts` and the components and renders:

- **Color** — swatch grid: name, token key, value.
- **Type** — one specimen per scale step with its name/metrics.
- **Spacing / radii** — visual scale.
- **Fonts** — Inter + JetBrains Mono samples.
- **Components** — Button (all variants/sizes), Card, Badge, Separator, Link
  (all variants), Heading (1–3), Text (all variants), layout primitives.

It is built from the same primitives (so it obeys the lockdown too) and serves as
both documentation and a visual smoke surface.

## Conversion order & verification

1. `tokens.ts` + `gen:theme` + `globals.css @theme`.
2. Brand primitives (`components/brand/*`).
3. shadcn adds: `npx shadcn@latest add badge separator`.
4. `/brand` catalog page.
5. Rewrite `layout.tsx`, `page.tsx`, `CopyCommand.tsx` to compose only the system.
6. Enable the strict ESLint overrides LAST (so conversion lands clean).

**Gates (no unit tests — lint + build are the gates):**
- `npm run build` passes.
- `npx eslint .` passes clean on the converted code.
- **Prove the rules bite:** temporarily insert a raw `<a>`, an inline
  `style={{}}`, and a `className="bg-[#fff]"` in a page; confirm eslint errors on
  each; remove them. Document this check in the plan.

## Out of scope

- Finite Tailwind class allowlist (see Boundary above).
- Visual regression tooling / screenshot diffing.
- Redesign of the page's content or layout — this is a structural/system
  conversion, not a visual redesign (the look stays the dark `#0d0f14` /
  `#4c8dff` aesthetic, now expressed via tokens).
- Changes to the `host/` or `extension/` packages.
