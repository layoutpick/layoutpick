# LayoutPick

Pick any element on a web page and send it to your Claude Code session.

## How it works

1. **Pick in Chrome:** Press `Alt+S` (or click the toolbar icon) to toggle the element picker overlay.
2. **Select an element:** Hover and click any element on the page.
3. **Capture:** The extension captures a markdown description + cropped screenshot to `~/.layoutpick/inbox/`.
4. **Pull into Claude Code:** Run `/pick` in a Claude Code session to load the capture as `@`-refs.

## Install (users)

```bash
curl -fsSL https://layoutpick.com/install.sh | sh
```

Then add the extension from the [Chrome Web Store](https://chromewebstore.google.com/).

Make sure `~/.layoutpick/bin` is on your PATH so the `/pick` command can find `layoutpick`:

```bash
export PATH="$HOME/.layoutpick/bin:$PATH"
```

(The installer prints this hint.)

## Develop

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build the binary (host/dist/layoutpick)
bun run build:host

# Build the extension bundle (extension/content-main.bundle.js)
node extension/build.mjs

# Register the native host + /pick command locally
host/dist/layoutpick install

# Load the extension unpacked
# Chrome → chrome://extensions → Developer mode → Load unpacked → select extension/ dir
```

After building and installing locally, you can test via:
1. Fully quit and reopen Chrome (native-messaging manifests are read at startup).
2. Press `Alt+S` on any web page, click an element.
3. Run `/pick` in a Claude Code session.

See `docs/smoke-test.md` for the full end-to-end manual test.

## Architecture

```
Chrome (any page)              layoutpick binary                 Claude Code
┌──────────────┐   native     ┌──────────────────────┐           ┌─────────────┐
│ extension    │──messaging──▶│ host mode:           │  writes   │ /pick       │
│ (overlay +   │              │ write capture to     │──────────▶│ runs        │
│ capture)     │              │ ~/.layoutpick/inbox/ │  md+png   │ `layoutpick │
└──────────────┘              └──────────────────────┘           │  latest`    │
                                       ▲                         └─────────────┘
                              install.sh fetches binary
                              from GitHub Releases + registers
```

- **Extension** (`extension/`): MV3 Chrome extension. Overlay + capture via `chrome.tabs.captureVisibleTab`, native messaging to the host binary.
- **Host binary** (`host/`): Standalone macOS binary. Three modes:
  - **host** (default): Receive captures over native messaging, write to inbox.
  - **`layoutpick install`**: Register the native host manifest + `/pick` command.
  - **`layoutpick latest`**: Return the newest capture(s) from the inbox, move them to consumed.
- **/pick command** (`commands/pick.md`): Claude Code slash command that calls `layoutpick latest`.

For the full design doc, see `specs/2026-06-17-layoutpick-design.md`.

## Owner checklist (to ship)

- [ ] Save `extension/key.pem` somewhere safe. It pins the extension ID `clpdpbkgpffdopfghhmbdbglfjgjlhop` and is gitignored.
- [ ] Submit `extension/` to the Chrome Web Store ($5 dev account + review). Once approved, update `WEB_STORE_URL` in `host/src/config.ts` and the placeholder in `web/index.html`.
- [ ] Point layoutpick.com DNS at the Vercel project and deploy `web/`.
- [ ] Push a `v0.1.0` tag to trigger `.github/workflows/release.yml`, which builds and publishes the macOS binaries. The installer downloads from the latest release.

## Status

**macOS + Chrome MVP**. Windows/Linux and other Chromium browsers are deferred.

- Extension: MV3, store-ready, 26 tests passing.
- Binary: bun-compiled standalone, no runtime dependencies.
- Landing page: Vercel, static.
- Tests: `bun test` (unit + smoke).
