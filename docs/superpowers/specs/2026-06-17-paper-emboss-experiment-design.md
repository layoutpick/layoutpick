# Paper emboss experiment (`/brand/paper`) — design

**Date:** 2026-06-17
**Status:** Approved, pre-implementation
**Scope:** Sandboxed visual experiment. No changes to `web/src/lib/tokens.ts`, the live brand, or any shipped page.

## Goal

Establish the foundational texture for LayoutPick's intended paper-like skeuomorphic
brand by rendering the LayoutPick wordmark physically **debossed** (pressed into) a sheet
of paper. Built with the rigor of Aave's "glass for the web" approach — *procedurally
generate maps, drive real SVG filter chains* — rather than CSS drop-shadow fakery.

This is a playground to tune the look. Promoting it to the real brand (touching tokens,
replacing the dark theme) is explicitly out of scope and a later decision.

## Background: the two researched techniques

- **Aave glass** (reference for *rigor*, not the look): generate a displacement-map PNG
  from real surface/refraction math, feed `feDisplacementMap`, layer chromatic aberration
  + specular highlight, apply as `backdrop-filter`. The principle we borrow: *the relief
  is computed from a generated map and a physically-motivated filter chain.*
- **Paper relief** (the look we want): a height map drives SVG **lighting** filters
  (`feDiffuseLighting` + `feSpecularLighting`) to produce real shaded relief, over a warm
  paper base (tone gradient + low-opacity desaturated `feTurbulence` grain).

The emboss is the paper analogue of Aave's pipeline:
`alpha → heightmap → bevel ramp (blur) → lit surface → composited back into the sheet`.

## Architecture

The `web/` ESLint lockdown forbids native HTML, inline `style`, raw SVG, literal colors,
and arbitrary Tailwind values in `src/app/**` and most of `src/components/**`. Texture
work *requires* raw SVG / data-URIs / inline filter primitives. Therefore all such code
lives in the **exempt** `src/components/brand/**` directory; the page only composes those
components, keeping the lockdown intact.

```
web/src/components/brand/paper/
  paper-filters.tsx   — a hidden <svg> holding reusable <filter> defs (deboss + emboss)
  PaperSurface.tsx    — the warm sheet: base tone + faint radial tone gradient
                        + feTurbulence grain + layered warm shadow
  EmbossedMark.tsx    — renders the LayoutPick wordmark with the deboss/emboss filter applied
web/src/app/brand/paper/page.tsx
                      — composes PaperSurface + EmbossedMark; small live-tuning controls
```

### `PaperSurface.tsx` — the sheet

- Warm off-white base fill (e.g. `#f4ecd8`-family), defined locally in this exempt
  component (NOT added to `tokens.ts`).
- Faint `radial-gradient` tone shift so the sheet isn't dead-flat.
- Grain: inline data-URI `feTurbulence` (`type="fractalNoise"`, `baseFrequency ~0.8`,
  `numOctaves` 3–4, `stitchTiles="stitch"`), desaturated via
  `feColorMatrix type="saturate" values="0"`, composited at ~5% opacity with
  `background-blend-mode: multiply`.
- Layered, warm-tinted, low-alpha `box-shadow` stack so the sheet reads as a physical
  object on a surface (no single hard black shadow).
- Exposes props for the tunable knobs (grain frequency, grain opacity) so the page's
  controls can drive it.

### `paper-filters.tsx` — the filter chain (core engineering)

A `<filter>` that debosses its input, in this order:

1. `SourceAlpha` of the mark = the height map.
2. `feGaussianBlur` on the alpha → the bevel falloff ramp (`stdDeviation` = bevel
   softness; sharp = hard pressed edge, soft = rounded emboss).
3. `feDiffuseLighting` + `feDistantLight` (azimuth ~225°, low elevation ~45°,
   `surfaceScale` = depth) → broad shaded relief.
4. `feSpecularLighting` (tight `specularExponent`, controlled `specularConstant`) →
   the catch-light highlight on the lip of the relief.
5. `feComposite` / `feBlend` to recombine diffuse + specular and merge the lit relief
   onto the paper so it reads as pressed into the *same* sheet.

Provide two variants: **deboss** (light from above, shadow inside the letters = pressed
in) and **emboss** (inverted light = raised out), selectable via a prop. Each filter
needs a stable unique `id`; if live-tuning forces filter re-evaluation issues, regenerate
the `id` on change (the Safari-cache trick Aave uses).

### `EmbossedMark.tsx`

Renders the LayoutPick wordmark (SVG text or path) and applies the chosen filter. Accepts
deboss/emboss mode + the lighting/bevel/depth params as props.

### `page.tsx`

Composes `PaperSurface` containing `EmbossedMark`. Includes a small controls panel
(built only from existing design-system components where possible; any native control
input lives in an exempt brand component) to live-tune: deboss⇄emboss, light azimuth,
light elevation, bevel softness (`stdDeviation`), depth (`surfaceScale`), grain frequency,
grain opacity. Purpose: let the user dial in the look by eye, the way Aave tuned their
specular pass.

## Data flow

Page state (the tuning params) → props → `PaperSurface` (grain params) and
`EmbossedMark` (lighting/bevel/depth + mode) → inline SVG filter attributes. One
direction, no shared mutable state.

## Error / edge handling

- Filters degrade gracefully: if SVG lighting filters are unsupported, the mark still
  renders as plain text on the paper (no crash, just no relief). Acceptable for a
  Chrome-only sandbox.
- Keep the filtered region sized so relief/highlights aren't clipped at the mark edges.

## Testing & verification

- `npx eslint .` in `web/` must exit 0 (the design-system lockdown gate).
- `npm run verify` (`next build && eslint`) must pass before declaring done — as a normal
  correctness check.
- Visual confirmation: load `/brand/paper`, screenshot, iterate on the look with the user.
  No automated visual test for this experiment.

## Out of scope (YAGNI)

- Any change to `tokens.ts`, `globals.css`, or shipped pages.
- Glass / refraction (`feDisplacementMap`) treatment — explicitly rejected in favor of
  paper emboss.
- Deckled edges, folds, multi-sheet stacks — possible later, not now.
- Baked PNG grain export — start procedural; bake only if perf demands it later.
```
