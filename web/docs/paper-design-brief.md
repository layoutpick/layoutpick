# Paper brand — design brief (art direction)

Persistent art direction for LayoutPick's paper aesthetic. Every paper-related build
references this. Goal bar: it must read as **real** (photographic paper, real depth/light),
the way Aave's glass reads as real — not a CSS approximation.

## Subject (grounding)

LayoutPick lets you **pick/clip** a DOM element in Chrome and hand a markdown description +
cropped screenshot to Claude Code. The honest skeuomorph is therefore **a clipping**: you
cut a piece out of a page and pass it along. The brand is that act made physical.

Audience: developers using Claude Code on macOS. The page's single job: make "clip a piece
of the page, send it to your AI" feel tactile and obvious.

## Anti-defaults (consciously avoided)

- NOT "warm cream + high-contrast serif + terracotta" (AI default #1 — where I kept drifting).
- NOT procedural CSS noise pretending to be paper. Paper = **real photographic assets**.
- NOT a centered card floating on black.

## Palette (4–6 named values)

- `paper`   `#f3efe6` — real photographed stock (the actual color comes from the photo; this is the tint anchor)
- `ink`     `#1c1a16` — near-black warm, for type that sits ON paper
- `pick`    `#4c8dff` — the brand blue, used ONLY as the selection marquee (the product's own picker color)
- `desk`    `#2a2520` — warm dark desk/surround the paper sits on
- `shadow`  `rgba(40,28,12,.28)` — warm contact shadow, never pure black
- `tape`    `#e3d8b8` — translucent matte tape

The blue is the single accent and it is *diegetic* — it's literally the picker's selection
rectangle, not decoration.

## Type (2+ roles, deliberately not a generic serif)

- **Display:** a characterful grotesque (candidate: Bricolage Grotesque / Clash Display) —
  used with restraint, for the headline. The wordmark itself is **blind-debossed into the paper**.
- **Utility / labels / the "clipped" annotation:** **mono** (JetBrains Mono — already a project
  font). Mono = code; it ties the paper to the dev-tool subject and reads as the markdown/screenshot
  payload LayoutPick produces.
- Body: a quiet, readable sans for any supporting copy.

## Layout concept

A real sheet/clipping of paper on a warm desk. The hero is the clipping, not a logo card.

```
┌──────────────────────────────────────────────┐   desk (warm dark)
│                                                │
│      ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  ‹tape›    │
│      ╎  (real paper, torn edge)    ╎           │   ← dashed marquee = the "pick"
│      ╎     L a y o u t P i c k     ╎           │     in brand blue (#4c8dff)
│      ╎  ‹mono› picked · sent to CC ╎           │
│      └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘            │
│                                                │
└──────────────────────────────────────────────┘
```

## Signature (the one memorable element)

**The selection marquee on paper.** A dashed blue selection rectangle — pixel-for-pixel the
language of LayoutPick's actual picker overlay — drawn around a real torn-paper clipping, with
a small mono caption like a clipped annotation. "You picked this piece of the page." Everything
else (paper, type, tape) stays quiet so the marquee + the realness of the paper carry it.

## Realness checklist (the bar the critic scores against)

1. Paper is a real photograph — real fiber, real edges, real thickness.
2. Real, soft, directional shadows; the paper sits in a lit scene.
3. The deboss reads as pressed INTO the fiber, not a floating shadow.
4. The blue marquee looks like the actual picker (crisp dashed stroke, right blue), not a border decoration.
5. No element reads as "CSS-faked." If any does, it's not done.

## Asset

Real CC0/Pexels paper photo committed to `web/public/paper/`. License: commercial-OK, no
attribution. (Source noted in the asset README.)
