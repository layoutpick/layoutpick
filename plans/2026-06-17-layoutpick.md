# LayoutPick Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement task-by-task. Steps use `- [ ]`.

**Goal:** Ship LayoutPick — a Chrome extension + bun-compiled `layoutpick` binary + `/pick` Claude Code command + Vercel landing page — that sends a picked web element into a Claude Code session.

**Architecture:** Chrome extension picks an element → native-messaging → `layoutpick` host writes to `~/.layoutpick/inbox/` → `/pick` runs `layoutpick latest` to pull the newest capture into the session. See `specs/2026-06-17-layoutpick-design.md`.

**Tech Stack:** TypeScript, Bun (runtime + `bun build --compile` + `bun test`), MV3, GitHub Actions, Vercel (static/Next landing).

**Source to reuse:** the prototype at `/Users/simaonogueira/Developer/simaos-claude-config` — port (don't re-invent) the picker overlay (`src/picker-overlay.ts` `PICKER_SOURCE`), the markdown/write core (`src/picker-write.ts`), crop math (`src/crop.ts`), native-messaging framing (`helium/native-host/framing.mjs`), and the extension content scripts + service worker (`helium/extension/*`). Strip all Helium/VSCode specifics.

---

## Task 1: Repo scaffold + Bun + tooling

**Files:** `package.json`, `tsconfig.json`, `.gitignore`, `bunfig.toml` (if needed), `README.md`

- [ ] Init a Bun TS project at repo root with workspaces or a flat `host/` + `extension/` + `web/` layout. `package.json` scripts: `build:host`, `build:ext`, `test`.
- [ ] `.gitignore`: `node_modules`, `dist/`, `*.tsbuildinfo`, `~`-style local, `host/dist/`, `web/.next/`, built binaries.
- [ ] Confirm `bun test` runs (add a trivial passing test).
- [ ] Commit: `chore: scaffold layoutpick bun project`.

## Task 2: Port the capture write core (`host/src/capture.ts`)

**Files:** `host/src/capture.ts`, `host/test/capture.test.ts`

- [ ] Port `formatMarkdown` + a `writeCapture({inboxDir, payload, png})` from the prototype's `src/picker-write.ts`, but write to a flat inbox dir (no gitignore/workspace logic). `PickedPayload` type included.
- [ ] Tests: markdown contains selector/size/html; writes md always, png when buffer present; returns the written paths.
- [ ] Commit: `feat(host): capture write core`.

## Task 3: Port crop math + framing

**Files:** `host/src/crop.ts`, `host/src/framing.ts`, tests

- [ ] Port `cropBox(rect{x,y,width,height}, dpr, img{w,h})` from prototype `src/crop.ts` (used by the extension service worker, but keep a TS copy for the shared crop unit test). Port `encodeMessage` + `FrameReader` from `helium/native-host/framing.mjs` to TS `host/src/framing.ts`.
- [ ] Tests: crop scaling/clamp/negative-origin; framing encode + split-chunk reassembly.
- [ ] Commit: `feat(host): crop math + native-messaging framing`.

## Task 4: Inbox + `latest` (`host/src/inbox.ts`)

**Files:** `host/src/inbox.ts`, `host/test/inbox.test.ts`

- [ ] `inboxDir()` = `~/.layoutpick/inbox`, `consumedDir()` = `~/.layoutpick/consumed`.
- [ ] `latest(count): {mdPath, pngPath?}[]` — newest `element-*.md` by mtime, paired with sibling `.png`; MOVE served files to consumed; prune consumed to most-recent 50. Returns [] when inbox empty.
- [ ] `refsFor(captures): string` — `@<absMd> <absPng?>` joined per capture (absolute paths so `/pick` works from any cwd).
- [ ] Tests: returns newest N, moves to consumed, empty inbox → [], prune keeps ≤50.
- [ ] Commit: `feat(host): inbox latest + consume/prune`.

## Task 5: Install logic (`host/src/install.ts`)

**Files:** `host/src/install.ts`, `host/test/install.test.ts`, `commands/pick.md`

- [ ] `nmManifest(binPath, extId)` → the Chrome native-messaging manifest object (`name: com.layoutpick.host`, `path: binPath`, `type: stdio`, `allowed_origins: ["chrome-extension://<extId>/"]`). Pure → unit-tested.
- [ ] `nmManifestPath()` = `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.layoutpick.host.json`.
- [ ] `runInstall(binPath)`: write the manifest, copy `commands/pick.md` → `~/.claude/commands/pick.md`, print next steps (Web Store URL placeholder + usage). Bundle `pick.md` content as a string constant so the compiled binary is self-contained.
- [ ] `commands/pick.md`: front-matter `description`, `allowed-tools: Bash(layoutpick:*)`; body: "Run `layoutpick latest --count {{count|1}}` and read the returned file paths as the user's selected UI element(s)." Use `$ARGUMENTS` for the optional count.
- [ ] Tests: manifest shape; manifest path; install writes both files to a temp HOME.
- [ ] Commit: `feat(host): install (NM manifest + /pick command)`.

## Task 6: Binary entrypoint + mode detection (`host/src/main.ts`)

**Files:** `host/src/main.ts`, `host/test/cli.test.ts`

- [ ] `main(argv)`: `argv[0]==='install'` → runInstall(self path via `process.execPath`/`Bun.main`); `argv[0]==='latest'` → parse `--count`, print `refsFor(latest(count))` (or the empty-inbox message + exit 1); otherwise → host mode (FrameReader over stdin → writeCapture → reply frame; pbcopy fallback NOT needed — inbox always available).
- [ ] Host mode writes to `inboxDir()`, replies `{ok, message}`.
- [ ] Test the arg routing (mock the three branches); host stdio covered by manual smoke.
- [ ] `package.json`: `build:host` = `bun build host/src/main.ts --compile --outfile host/dist/layoutpick`.
- [ ] Build the binary; smoke: `host/dist/layoutpick latest` (empty inbox message), and pipe a synthetic frame to confirm a file lands in `~/.layoutpick/inbox/`.
- [ ] Commit: `feat(host): binary entrypoint + mode detection`.

## Task 7: Chrome extension (`extension/`)

**Files:** `extension/manifest.json`, `extension/content-main.js`, `extension/content-relay.js`, `extension/service-worker.js`, `extension/icons/*`, build step to inline the overlay

- [ ] Port the prototype's `helium/extension/*` content scripts + service worker. Change native host name to `com.layoutpick.host`. Keep the toast routing fix.
- [ ] `manifest.json`: MV3, name "LayoutPick", `key` (generate a keypair; put the base64 public key in `key` so the ID is stable), permissions `tabs`/`scripting`/`nativeMessaging`, `host_permissions: ["<all_urls>"]`, action + `Alt+S` command, the two content scripts (MAIN bundle + ISOLATED relay).
- [ ] Port the overlay-inlining build (`scripts/gen + bundle`) from the prototype so `content-main.bundle.js` carries `PICKER_SOURCE`. Source the overlay from `host/src` or a shared `shared/picker-overlay.ts` (single source of truth).
- [ ] Add icons (16/48/128) — simple generated mark is fine for MVP.
- [ ] Compute + record the stable extension ID from the pinned key (document it; the installer/manifest use it).
- [ ] Commit: `feat(extension): Chrome MV3 picker`.

## Task 8: install.sh + release workflow

**Files:** `install.sh`, `.github/workflows/release.yml`

- [ ] `install.sh`: detect macOS + arch; `curl -fsSL` the matching `layoutpick` asset from the latest GitHub Release into `~/.layoutpick/bin/layoutpick`; chmod; `exec` `layoutpick install`. Fail clearly on non-macOS.
- [ ] `release.yml`: on `v*` tag, build arm64 + x64 binaries with bun, upload to the GitHub Release as `layoutpick-darwin-arm64` / `layoutpick-darwin-x64`.
- [ ] Commit: `feat: installer + release workflow`.

## Task 9: Vercel landing page (`web/`)

**Files:** `web/` (static `index.html` + `install.sh` copy, or minimal Next app), `vercel.json`

- [ ] Single page: hero, two steps (Add to Chrome button → Web Store URL placeholder; the curl command with copy button), usage guide (`Alt+S` → `/pick`). Serve `install.sh` from `/install.sh` (copy/symlink the root `install.sh`).
- [ ] Keep it static + dependency-light; match a clean product aesthetic.
- [ ] Commit: `feat(web): layoutpick.com landing page`.

## Task 10: README + manual smoke doc

**Files:** `README.md`, `docs/smoke-test.md`

- [ ] README: what it is, dev setup (`bun install`, `bun run build:host`, `bun run build:ext`), the owner submission checklist (Web Store, DNS, first release).
- [ ] `docs/smoke-test.md`: the end-to-end manual test steps.
- [ ] Commit: `docs: readme + smoke test`.

---

## Notes
- **macOS + Chrome only** for MVP. Chromium siblings/Windows/Linux are deferred (different NM manifest locations).
- **Single source of truth** for the overlay — generate the extension copy, never hand-edit it.
- **Owner-only steps:** Web Store submit, layoutpick.com DNS → Vercel, first release tag.
