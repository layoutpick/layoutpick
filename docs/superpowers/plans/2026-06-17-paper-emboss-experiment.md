# Paper Emboss Experiment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a sandboxed `/brand/paper` page showing the LayoutPick wordmark debossed into a sheet of paper, using procedurally generated maps + real SVG lighting filter chains.

**Architecture:** All raw SVG / data-URI / filter code lives in the ESLint-exempt `web/src/components/brand/paper/` directory; the `app/brand/paper` page only composes those components. State (tuning params) flows one-way down via props into inline SVG filter attributes.

**Tech Stack:** Next.js 16 (React, client component for the controls), TypeScript, inline SVG filters (`feTurbulence`, `feGaussianBlur`, `feDiffuseLighting`, `feSpecularLighting`, `feComposite`/`feBlend`), Tailwind v4.

## Global Constraints

- No changes to `web/src/lib/tokens.ts`, `web/src/app/globals.css`, or any shipped page. Paper colors are local to the exempt brand components only.
- Raw SVG, native HTML, inline `style`, literal colors, and arbitrary Tailwind values are allowed ONLY in `web/src/components/brand/**` (and the other exempt dirs). NOT in `web/src/app/brand/paper/page.tsx` beyond composing design-system + brand components.
- `npx eslint .` (run from `web/`) MUST exit 0.
- `npm run verify` (`next build && eslint`) MUST pass before the work is declared done.
- Chrome-only target; graceful no-relief fallback is acceptable, no crash.

---

### Task 1: Paper filter defs (`paper-filters.tsx`)

**Files:**
- Create: `web/src/components/brand/paper/paper-filters.tsx`

**Interfaces:**
- Produces: `PaperFilters` React component rendering a visually-hidden `<svg>` containing two `<filter>` defs. Props: `{ mode: "deboss" | "emboss"; azimuth: number; elevation: number; bevel: number; depth: number; idSuffix: string }`. Exposes the filter id via a helper `paperFilterId(idSuffix: string): string` returning `` `paper-relief-${idSuffix}` ``.
- Consumes: nothing.

- [ ] **Step 1: Create the component file**

```tsx
// web/src/components/brand/paper/paper-filters.tsx
// Exempt dir: raw SVG / filter primitives are allowed here.
export function paperFilterId(idSuffix: string): string {
  return `paper-relief-${idSuffix}`
}

export interface PaperFiltersProps {
  mode: "deboss" | "emboss"
  azimuth: number
  elevation: number
  bevel: number // feGaussianBlur stdDeviation — bevel softness
  depth: number // surfaceScale — relief depth
  idSuffix: string // changed on tune to force filter re-eval (Safari cache trick)
}

export function PaperFilters({ mode, azimuth, elevation, bevel, depth, idSuffix }: PaperFiltersProps) {
  // Deboss = light from above casts shadow INSIDE letters (pressed in).
  // Emboss = invert the light azimuth so letters appear raised.
  const azi = mode === "emboss" ? (azimuth + 180) % 360 : azimuth
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id={paperFilterId(idSuffix)} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          {/* 1. mark alpha is the height map; 2. blur it into a bevel ramp */}
          <feGaussianBlur in="SourceAlpha" stdDeviation={bevel} result="ramp" />
          {/* 3. broad diffuse relief */}
          <feDiffuseLighting in="ramp" surfaceScale={depth} diffuseConstant="1" lightingColor="#ffffff" result="diffuse">
            <feDistantLight azimuth={azi} elevation={elevation} />
          </feDiffuseLighting>
          {/* multiply diffuse over the original mark color so it tints the relief */}
          <feComposite in="diffuse" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="diffuseShaded" />
          {/* 4. specular catch-light on the lip */}
          <feSpecularLighting in="ramp" surfaceScale={depth} specularConstant="0.8" specularExponent="18" lightingColor="#ffffff" result="spec">
            <feDistantLight azimuth={azi} elevation={elevation} />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specClipped" />
          {/* 5. combine shaded relief + highlight */}
          <feBlend in="diffuseShaded" in2="specClipped" mode="screen" />
        </filter>
      </defs>
    </svg>
  )
}
```

- [ ] **Step 2: Typecheck**

Run (from repo root): `cd web && npx tsc --noEmit -p tsconfig.json` (or `npm run build` later). Expected: no errors in `paper-filters.tsx`.

- [ ] **Step 3: Lint the file**

Run (from `web/`): `npx eslint src/components/brand/paper/paper-filters.tsx`
Expected: exit 0 (exempt dir permits raw SVG/inline style).

- [ ] **Step 4: Commit**

```bash
git add web/src/components/brand/paper/paper-filters.tsx
git commit -m "feat(brand): paper relief SVG filter defs"
```

---

### Task 2: Paper surface (`PaperSurface.tsx`)

**Files:**
- Create: `web/src/components/brand/paper/PaperSurface.tsx`

**Interfaces:**
- Produces: `PaperSurface` component. Props: `{ grainFrequency: number; grainOpacity: number; children: React.ReactNode; className?: string }`. Renders a warm padded sheet with tone gradient + feTurbulence grain + layered warm shadow, wrapping `children`.
- Consumes: nothing.

- [ ] **Step 1: Create the component**

```tsx
// web/src/components/brand/paper/PaperSurface.tsx
// Exempt dir: native elements / inline style / literal colors allowed here.
import type { ReactNode } from "react"

export interface PaperSurfaceProps {
  grainFrequency: number // feTurbulence baseFrequency (~0.8 for fine grain)
  grainOpacity: number // 0–1, ~0.05 for realism
  children: ReactNode
  className?: string
}

const PAPER_BASE = "#f4ecd8"

function grainDataUri(frequency: number, opacity: number): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${opacity}'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export function PaperSurface({ grainFrequency, grainOpacity, children, className }: PaperSurfaceProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: PAPER_BASE,
        backgroundImage: `radial-gradient(120% 120% at 30% 20%, #faf4e6 0%, #efe5cf 60%, #e8ddc4 100%), ${grainDataUri(grainFrequency, grainOpacity)}`,
        backgroundBlendMode: "multiply, multiply",
        borderRadius: 4,
        padding: "64px 48px",
        boxShadow:
          "0 1px 1px rgba(60,45,20,.04), 0 2px 2px rgba(60,45,20,.04), 0 4px 8px rgba(60,45,20,.06), 0 8px 16px rgba(60,45,20,.08), inset 0 0 0 1px rgba(255,255,255,.4)",
      }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Lint**

Run (from `web/`): `npx eslint src/components/brand/paper/PaperSurface.tsx`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add web/src/components/brand/paper/PaperSurface.tsx
git commit -m "feat(brand): paper surface with grain and warm shadow"
```

---

### Task 3: Embossed mark (`EmbossedMark.tsx`)

**Files:**
- Create: `web/src/components/brand/paper/EmbossedMark.tsx`

**Interfaces:**
- Produces: `EmbossedMark` component. Props: `{ mode: "deboss" | "emboss"; azimuth: number; elevation: number; bevel: number; depth: number; idSuffix: string; text?: string }`. Renders `PaperFilters` + an SVG `<text>` wordmark with `filter` applied.
- Consumes: `PaperFilters`, `paperFilterId` from Task 1.

- [ ] **Step 1: Create the component**

```tsx
// web/src/components/brand/paper/EmbossedMark.tsx
// Exempt dir.
import { PaperFilters, paperFilterId, type PaperFiltersProps } from "./paper-filters"

export interface EmbossedMarkProps extends Omit<PaperFiltersProps, never> {
  text?: string
}

export function EmbossedMark({ mode, azimuth, elevation, bevel, depth, idSuffix, text = "LayoutPick" }: EmbossedMarkProps) {
  return (
    <>
      <PaperFilters mode={mode} azimuth={azimuth} elevation={elevation} bevel={bevel} depth={depth} idSuffix={idSuffix} />
      <svg viewBox="0 0 600 120" width="100%" role="img" aria-label={text}>
        <text
          x="300"
          y="84"
          textAnchor="middle"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontWeight="700"
          fontSize="72"
          fill="#d8cba8"
          filter={`url(#${paperFilterId(idSuffix)})`}
        >
          {text}
        </text>
      </svg>
    </>
  )
}
```

- [ ] **Step 2: Lint**

Run (from `web/`): `npx eslint src/components/brand/paper/EmbossedMark.tsx`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add web/src/components/brand/paper/EmbossedMark.tsx
git commit -m "feat(brand): embossed LayoutPick wordmark"
```

---

### Task 4: Controls panel (`PaperControls.tsx`)

**Files:**
- Create: `web/src/components/brand/paper/PaperControls.tsx`

**Interfaces:**
- Produces: `PaperControls` component + `PaperParams` type. `PaperParams = { mode: "deboss" | "emboss"; azimuth: number; elevation: number; bevel: number; depth: number; grainFrequency: number; grainOpacity: number }`. Props: `{ value: PaperParams; onChange: (next: PaperParams) => void }`. Renders native labeled range/select inputs (allowed in exempt dir).
- Consumes: nothing.

- [ ] **Step 1: Create the component**

```tsx
// web/src/components/brand/paper/PaperControls.tsx
// Exempt dir: native inputs allowed.
export interface PaperParams {
  mode: "deboss" | "emboss"
  azimuth: number
  elevation: number
  bevel: number
  depth: number
  grainFrequency: number
  grainOpacity: number
}

const NUM_FIELDS: { key: keyof PaperParams; label: string; min: number; max: number; step: number }[] = [
  { key: "azimuth", label: "Light azimuth", min: 0, max: 360, step: 1 },
  { key: "elevation", label: "Light elevation", min: 0, max: 90, step: 1 },
  { key: "bevel", label: "Bevel softness", min: 0, max: 8, step: 0.1 },
  { key: "depth", label: "Depth", min: 0, max: 6, step: 0.1 },
  { key: "grainFrequency", label: "Grain frequency", min: 0.1, max: 1.2, step: 0.01 },
  { key: "grainOpacity", label: "Grain opacity", min: 0, max: 0.2, step: 0.005 },
]

export function PaperControls({ value, onChange }: { value: PaperParams; onChange: (next: PaperParams) => void }) {
  return (
    <div style={{ display: "grid", gap: 12, padding: 16, fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#333" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ width: 130 }}>Mode</span>
        <select value={value.mode} onChange={(e) => onChange({ ...value, mode: e.target.value as PaperParams["mode"] })}>
          <option value="deboss">Deboss (pressed in)</option>
          <option value="emboss">Emboss (raised)</option>
        </select>
      </label>
      {NUM_FIELDS.map((f) => (
        <label key={f.key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 130 }}>{f.label}</span>
          <input
            type="range"
            min={f.min}
            max={f.max}
            step={f.step}
            value={value[f.key] as number}
            onChange={(e) => onChange({ ...value, [f.key]: Number(e.target.value) })}
          />
          <span style={{ width: 48, textAlign: "right" }}>{value[f.key] as number}</span>
        </label>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Lint**

Run (from `web/`): `npx eslint src/components/brand/paper/PaperControls.tsx`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add web/src/components/brand/paper/PaperControls.tsx
git commit -m "feat(brand): paper tuning controls"
```

---

### Task 5: The page (`app/brand/paper/page.tsx`)

**Files:**
- Create: `web/src/app/brand/paper/page.tsx`

**Interfaces:**
- Consumes: `PaperSurface` (Task 2), `EmbossedMark` (Task 3), `PaperControls` + `PaperParams` (Task 4). Design-system `Container`/`Section`/`Stack`/`Heading`/`Text`.
- Produces: the route `/brand/paper`.

- [ ] **Step 1: Create the client page**

```tsx
// web/src/app/brand/paper/page.tsx
"use client"
import { useState } from "react"
import { Container, Section, Stack } from "@/components/brand/layout"
import { Heading, Text } from "@/components/brand/typography"
import { PaperSurface } from "@/components/brand/paper/PaperSurface"
import { EmbossedMark } from "@/components/brand/paper/EmbossedMark"
import { PaperControls, type PaperParams } from "@/components/brand/paper/PaperControls"

const INITIAL: PaperParams = {
  mode: "deboss", azimuth: 225, elevation: 45, bevel: 1.6, depth: 2,
  grainFrequency: 0.8, grainOpacity: 0.05,
}

export default function PaperBrandPage() {
  const [params, setParams] = useState<PaperParams>(INITIAL)
  // idSuffix changes whenever relief params change → fresh filter id (Safari re-eval).
  const idSuffix = `${params.mode}-${params.azimuth}-${params.elevation}-${params.bevel}-${params.depth}`
  return (
    <Container className="max-w-screen-md">
      <Section>
        <Stack gap="xl">
          <Stack gap="sm">
            <Heading level={1}>Paper texture experiment</Heading>
            <Text muted>Debossed LayoutPick wordmark — procedural grain + SVG lighting relief.</Text>
          </Stack>
          <PaperSurface grainFrequency={params.grainFrequency} grainOpacity={params.grainOpacity}>
            <EmbossedMark
              mode={params.mode}
              azimuth={params.azimuth}
              elevation={params.elevation}
              bevel={params.bevel}
              depth={params.depth}
              idSuffix={idSuffix}
            />
          </PaperSurface>
          <PaperControls value={params} onChange={setParams} />
        </Stack>
      </Section>
    </Container>
  )
}
```

- [ ] **Step 2: Verify the page imports resolve and the route builds**

Run (from `web/`): `npm run build`
Expected: build succeeds, `/brand/paper` appears in the route output.

- [ ] **Step 3: Lint the whole project (the lockdown gate)**

Run (from `web/`): `npx eslint .`
Expected: exit 0. (If the page itself trips a rule, the offending markup must move into an exempt brand component — do NOT add inline style/native elements to the page.)

- [ ] **Step 4: Visual check**

Run (from `web/`): `npm run dev`, open `http://localhost:3000/brand/paper`. Confirm: warm paper sheet with visible-but-subtle grain, the wordmark reads as pressed into the paper, and dragging the sliders changes the relief live. Screenshot for the user.

- [ ] **Step 5: Commit**

```bash
git add web/src/app/brand/paper/page.tsx
git commit -m "feat(brand): /brand/paper emboss experiment page"
```

---

### Task 6: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full verify**

Run (from `web/`): `npm run verify`
Expected: `next build` succeeds AND `eslint` exits 0.

- [ ] **Step 2: Hand off the screenshot to the user for look tuning.**

---

## Self-Review

**Spec coverage:**
- Sandboxed, no token changes → Global Constraints + all paper colors local to components. ✓
- `PaperSurface` (tone + gradient + grain + shadow) → Task 2. ✓
- `paper-filters.tsx` deboss/emboss chain (alpha→blur→diffuse→specular→composite) → Task 1. ✓
- `EmbossedMark` → Task 3. ✓
- `page.tsx` with live controls (mode, azimuth, elevation, bevel, depth, grain freq, grain opacity) → Tasks 4 + 5. ✓
- Unique filter id regenerated on change → `idSuffix` in Task 5. ✓
- Graceful fallback (text still renders) → SVG `<text>` renders without filter support. ✓
- eslint exit 0 + `npm run verify` → Tasks 5, 6. ✓

**Placeholder scan:** No TBD/TODO; every code step has complete code. ✓

**Type consistency:** `PaperParams` keys (mode, azimuth, elevation, bevel, depth, grainFrequency, grainOpacity) consistent across Tasks 4/5; `PaperFiltersProps` (mode, azimuth, elevation, bevel, depth, idSuffix) consistent across Tasks 1/3; `paperFilterId(idSuffix)` used identically in Tasks 1 and 3. ✓

> **Note on TDD:** This is a visual SVG-filter sandbox; behavior is judged by eye, not unit assertions. The per-task verification is lint + build + render rather than failing-test-first. That is the appropriate test cycle for this work and is intentional.
