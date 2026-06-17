# LayoutPick — design

**Date:** 2026-06-17
**Status:** approved — ready for implementation plan
**Scope:** macOS + Chrome + `/pick` Claude Code command (MVP)

## Goal

Pick any element on any web page in **Chrome** and send it — a markdown
description + a cropped screenshot — into a **Claude Code** session via a `/pick`
command. Distributed as a Chrome Web Store extension + a one-line terminal
installer; instructions on a Vercel landing page (layoutpick.com).

Derived from the Helium picker prototype (`simaos-claude-config`), extracted
clean with no Helium- or VSCode-specific code.

## Architecture

```
Chrome (any page)              layoutpick binary                 Claude Code
┌──────────────┐   pick      ┌──────────────────────┐           ┌─────────────┐
│ extension    │──native────▶│ host mode:           │  writes   │ /pick [n]   │
│ (overlay +   │  messaging  │ write capture to     │──────────▶│ runs        │
│  capture)    │             │ ~/.layoutpick/inbox/ │  md+png   │ `layoutpick │
└──────────────┘             └──────────────────────┘           │  latest`    │
                                       ▲                         └─────────────┘
                              install.sh fetches binary
                              from GitHub Releases + registers
```

No per-session claim and no VSCode watcher (those were Helium/VSCode-specific).
The host always writes to a single global inbox; `/pick`, run inside whichever
Claude Code session you want, pulls the newest capture(s) into THAT session.

### 1. Chrome extension (`extension/`)

MV3, store-ready. Reused from the prototype:
- MAIN-world content script injects the picker overlay (`PICKER_SOURCE`), shims
  the emit binding to `postMessage`.
- ISOLATED-world relay forwards page → `chrome.runtime.sendMessage`, and relays
  toast/toggle back.
- Service worker: `chrome.tabs.captureVisibleTab` → crop to the element rect via
  `OffscreenCanvas` → `chrome.runtime.sendNativeMessage('com.layoutpick.host', …)`.
- Toolbar action + `Alt+S` command toggle the picker.

Productization changes vs prototype:
- Native host name → `com.layoutpick.host`.
- **Pinned `key`** in the manifest so the extension ID is identical for the
  unpacked dev build and the published store build (native messaging needs a
  fixed `allowed_origins` ID).
- Name "LayoutPick", icons (16/48/128), store listing copy.

### 2. `layoutpick` binary (`host/`)

One TypeScript program, bun-compiled to a standalone macOS binary (arm64 + x64) —
**no Node required on the user's machine**. Three modes:

- **host** (default when launched by Chrome over native messaging): read framed
  `{payload, pngBase64}` messages (4-byte LE length prefix + UTF-8 JSON), write
  `element-<ts>.md` + `element-<ts>.png` to `~/.layoutpick/inbox/`, reply with a
  status frame so the extension can toast.
- **`layoutpick install`**: write the Chrome native-messaging manifest to
  `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.layoutpick.host.json`
  (path = this binary's own absolute path; `allowed_origins` = pinned ext ID),
  copy the `/pick` command to `~/.claude/commands/pick.md`, print next steps.
- **`layoutpick latest [--count N]`**: print the absolute paths of the newest N
  inbox captures (default 1) as `@`-refs, then move them to
  `~/.layoutpick/consumed/` so the next `/pick` gets fresh ones. This is what
  `/pick` calls.

Mode detection: explicit subcommand argv (`install`/`latest`) → CLI; otherwise
(no args, launched by Chrome with the NM manifest path as argv) → host mode.

### 3. `/pick` command (`commands/pick.md`)

User-level Claude Code slash command, installed by `layoutpick install`. Its body
instructs Claude to run `layoutpick latest --count $ARGUMENTS` (default 1) and
read the returned file paths as the user's selected UI element(s). Same proven
shape as the prototype's `/simao-here`.

### 4. Installer (`install.sh`)

`curl -fsSL https://layoutpick.com/install.sh | sh`:
1. Detect macOS + arch (arm64/x64).
2. Download the matching `layoutpick` binary from the latest GitHub Release.
3. Install to `~/.layoutpick/bin/layoutpick`, `chmod +x`.
4. Run `layoutpick install`.
5. Print: "Now add the extension from the Chrome Web Store: <url>", and the
   `Alt+S` → `/pick` usage hint.

### 5. Landing page (`web/`)

Vercel, layoutpick.com. Single page:
- Hero (what it does, one-line).
- **Two steps:** (1) Add to Chrome [Web Store button]; (2) `curl -fsSL https://layoutpick.com/install.sh | sh`.
- Usage guide: pick with `Alt+S` (or toolbar) → switch to Claude Code → `/pick`.
- `install.sh` served as a static asset from the same deploy.

### 6. Release (`.github/workflows/release.yml`)

On tag push: bun-compile the binary for macOS arm64 + x64, attach both to a
GitHub Release. `install.sh` downloads from the latest release.

## Inbox lifecycle

- Host appends to `~/.layoutpick/inbox/`.
- `layoutpick latest` moves served captures to `~/.layoutpick/consumed/` (capped,
  pruned to the most recent ~50) so repeated `/pick` calls don't re-serve and the
  dir doesn't grow unbounded.
- If the inbox is empty, `layoutpick latest` prints a friendly "no recent pick —
  select an element in Chrome first" and exits non-zero; `/pick` relays that.

## Testing

- **Unit (bun test / vitest):** capture markdown format, rect-crop math, native-
  messaging framing, inbox `latest` selection + consume/prune, install path
  resolution (NM manifest contents, command copy).
- **Manual smoke (documented):** `layoutpick install`, load extension unpacked,
  `Alt+S` + click, `/pick` in a Claude Code session → capture enters the chat;
  empty-inbox case.

## Out of scope (MVP)

- Windows / Linux (paths, NM manifest location, clipboard differ).
- Per-project routing / `/simao-here` claim / VSCode auto-type (prototype-only).
- Full-element scroll-stitch screenshots (viewport crop only, as in the prototype).
- Browsers other than Chrome (Arc/Brave/Edge are Chromium and could be added by
  registering their NM manifest dirs later).

## Owner-completed steps (need accounts/domain)

- Chrome Web Store submission ($5 dev account + review).
- Point layoutpick.com DNS at the Vercel project.
- Tag the first release (or approve triggering the release workflow).
