# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

LayoutPick lets you pick a DOM element in **Chrome** and send a markdown description + cropped screenshot into a **Claude Code** session. macOS + Chrome only.

Three cooperating parts (the data flows one direction):

```
Chrome extension  ──native messaging──▶  layoutpick binary (host mode)  ──writes──▶  ~/.layoutpick/inbox/
   (MV3 picker)                              (com.layoutpick.host)                   element-<ts>.{md,png}
                                                                                            │
Claude Code:  /pick  ──runs──▶  `layoutpick latest`  ──reads/serves──▶  ───────────────────┘
```

- **`extension/`** — MV3 Chrome extension. A MAIN-world content script injects the picker overlay (`extension/picker-overlay.ts`, the canonical `PICKER_SOURCE`); on click the service worker `captureVisibleTab` → crops to the element rect → `chrome.runtime.sendNativeMessage('com.layoutpick.host', …)`.
- **`host/`** — one TypeScript program compiled to a standalone macOS binary with Bun (no Node needed on the user's machine). Three modes in `host/src/main.ts` (`host/src/cli.ts` routes argv): **host** (default; native-messaging stdio → writes capture to the inbox), **`install`** (registers the Chrome native-messaging manifest + copies `/pick` to `~/.claude/commands/`), **`latest`** (prints newest inbox capture paths as `@`-refs, moves them to `~/.layoutpick/consumed/`, prunes). `/pick` calls `layoutpick latest`.
- **`web/`** — Next.js 16 landing page (layoutpick.com) + optional $5 Stripe checkout. Has its own `CLAUDE.md`/`AGENTS.md` and a strict design system — read those before editing it.
- `commands/pick.md` is the canonical `/pick` slash command the installer copies. `install.sh` (`curl … | sh`) downloads the release binary and runs `layoutpick install`. `.github/workflows/release.yml` builds the arm64+x64 binaries on a `v*` tag.

## Commands

Root (Bun):

```bash
bun install
bun test                              # all host unit tests
bun test host/test/inbox.test.ts      # a single test file
bun run build:host                    # → host/dist/layoutpick (bun --compile)
bun run build:ext                     # → extension bundle (inlines PICKER_SOURCE)
bun run typecheck
```

Web (`cd web`, npm):

```bash
npm run dev                # local dev (port 3000)
npm run build              # production build — see the prod-vs-dev gotcha below
npx eslint .               # the design-system lockdown gate; MUST be exit 0
npm run gen:theme          # regenerate the Tailwind @theme block from tokens.ts
```

Manual end-to-end test of the picker lives in `docs/smoke-test.md`.

## `web/` design system — read before editing

`web/` enforces a **maximal-lockdown ESLint** config (`web/eslint.config.mjs`): in `src/app/**` and `src/components/**`, **no native HTML elements, no inline `style`, no literal colors / arbitrary Tailwind values**. App code composes only the design-system components: layout primitives (`Container`/`Section`/`Stack`/`Row`/`Box`), `Heading`/`Text`, `Link`, and shadcn `Button`/`Card`/`Badge`/`Separator`. Native elements are allowed only in the exempt dirs `src/components/ui/**`, `src/components/brand/**`, and `src/app/layout.tsx` — that's where primitives are defined. `/brand` is the living catalog of every token + component.

Tokens are the single source of truth: edit **`web/src/lib/tokens.ts`**, then run **`npm run gen:theme`** (regenerates the `@theme` block in `globals.css` between the `BEGIN/END GENERATED TOKENS` markers — never hand-edit that block). New UI must pass `npx eslint .`.

## Gotchas that have actually bitten this project

- **`web/` is Next.js 16 (Turbopack). Bugs can appear only in `next build` (prod), not `next dev`.** Several layout/CSS issues were invisible in dev. When verifying a `web/` change, check a production build (`npm run build && npm run start`) or the deploy, not just `npm run dev`. See `web/AGENTS.md`.
- **Don't put custom tokens in Tailwind v4's reserved namespaces.** A `--spacing-lg` token silently hijacks `max-w-lg`/`w-*`/`p-*` to that pixel value — spacing tokens are emitted as `--space-*` instead. Brand colors must avoid shadcn's names: the accent blue is `brand`/`--color-brand` (utility `text-brand`), NOT `accent` (which collides with shadcn's `--color-accent`). Fonts: `--font-sans` must point at `--font-inter`, not be self-referential.
- **The native-messaging host is spawned by Chrome with a minimal PATH** (no asdf/nvm/homebrew node). The host is launched via a wrapper that calls node by absolute path — see the install scripts. A bare `#!/usr/bin/env node` shebang fails when Chrome launches it.
- **Native-messaging manifests are read at browser startup** — fully quit and reopen Chrome after `layoutpick install` or re-registration.
- **Vercel project for `web/`**: Root Directory must be `web` and Framework `Next.js` (it was created as a static "Other" project; building from the repo root 404s). Pushes to `main` auto-deploy `web/`. Stripe checkout needs `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `NEXT_PUBLIC_BASE_URL` set on the project; live vs test keys/prices must match modes.

## Specs & plans

Design specs and implementation plans live in `specs/`, `plans/`, and `web/docs/`. They record the rationale behind the design system and the host architecture.
