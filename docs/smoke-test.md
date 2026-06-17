# LayoutPick smoke test

Manual end-to-end test: build, install, and verify the full flow from Chrome pick to Claude Code `/pick` command.

## Setup

1. **Build the binary:**
   ```bash
   bun run build:host
   ```
   You should see `host/dist/layoutpick` created.

2. **Build the extension:**
   ```bash
   node extension/build.mjs
   ```
   You should see `extension/content-main.bundle.js` created (and `extension/service-worker.js`).

3. **Install the native host + command:**
   ```bash
   host/dist/layoutpick install
   ```
   This registers the Chrome native-messaging manifest to `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.layoutpick.host.json` and copies the `/pick` command to `~/.claude/commands/pick.md`.

4. **Load the extension unpacked in Chrome:**
   - Open `chrome://extensions/`.
   - Enable Developer mode (top-right toggle).
   - Click Load unpacked.
   - Select the `extension/` directory.
   - Verify the extension appears with ID `clpdpbkgpffdopfghhmbdbglfjgjlhop` and no warnings.

5. **Fully quit and reopen Chrome:**
   - Chrome must restart to read the native-messaging manifest.
   - Command+Q to fully quit (not just closing the window).
   - Reopen Chrome.

## Test flow

6. **Open a web page** (any site will do; `example.com` is fine).

7. **Toggle the picker:**
   - Press `Alt+S` (or click the LayoutPick extension icon in the toolbar).
   - You should see an overlay appear on the page.

8. **Pick an element:**
   - Hover over any element on the page (e.g., a heading, button, or link).
   - Elements should highlight as you hover.
   - Click an element.
   - A toast should appear: "captured element-<timestamp>.md + .png" (or similar).

9. **Verify the capture was written:**
   ```bash
   ls -lah ~/.layoutpick/inbox/
   ```
   You should see a new `element-<timestamp>.md` and `element-<timestamp>.png` pair. The `.md` file should contain a structured description of the element; the `.png` should be a cropped screenshot.

10. **Open Claude Code** and run `/pick`:
    ```
    /pick
    ```
    The command should fetch the newest capture from `~/.layoutpick/inbox/` and pull the markdown + screenshot into the session as `@`-refs. You should be able to reference the element in your conversation.

11. **Test the empty-inbox case:**
    - Run `/pick` again **immediately** (without picking a new element).
    - You should see a message like "No recent pick — select an element in Chrome first (Alt+S)".
    - The captures from step 10 should have been moved to `~/.layoutpick/consumed/`.

## Verification checklist

- [ ] `host/dist/layoutpick` built successfully.
- [ ] `extension/content-main.bundle.js` built successfully.
- [ ] `host/dist/layoutpick install` ran without errors.
- [ ] Extension loaded in Chrome (ID matches `clpdpbkgpffdopfghhmbdbglfjgjlhop`).
- [ ] Chrome was fully quit and reopened.
- [ ] `Alt+S` toggles the picker overlay on a web page.
- [ ] Clicking an element produces a toast message.
- [ ] `~/.layoutpick/inbox/` contains a new `element-*.md` + `element-*.png` pair.
- [ ] `/pick` in Claude Code pulls the capture as `@`-refs.
- [ ] Running `/pick` a second time shows "No recent pick" message.
- [ ] Consumed captures appear in `~/.layoutpick/consumed/`.

## Troubleshooting

### `/pick` says "layoutpick not found"

**Cause:** `~/.layoutpick/bin` is not on your PATH.

**Fix:** Add it to your shell profile:
```bash
export PATH="$HOME/.layoutpick/bin:$PATH"
```

Then restart your terminal or source your profile.

### Extension doesn't respond to `Alt+S` or toolbar icon

**Cause:** Chrome didn't read the native-messaging manifest because it wasn't fully restarted.

**Fix:**
- Command+Q to fully quit Chrome (not just closing the window).
- Reopen it.

### `/pick` says the element capture doesn't exist or is missing from the chat

**Cause:** The extension failed to capture or write to the inbox.

**Verify:**
- Check `~/.layoutpick/inbox/` to confirm the file was written.
- If not, check the browser console (F12 → Console) for errors.
- Ensure the extension ID in `chrome://extensions/` matches `clpdpbkgpffdopfghhmbdbglfjgjlhop`.

### Extension ID doesn't match `clpdpbkgpffdopfghhmbdbglfjgjlhop`

**Cause:** The extension key in `extension/manifest.json` is different, or the manifest was regenerated.

**Fix:**
- Verify the `"key"` field in `extension/manifest.json` hasn't changed.
- If you regenerated it, update `LAYOUTPICK_EXT_ID` in `host/src/config.ts` to match, rebuild the binary, and reinstall.
- (In production, the extension key is pinned and immutable.)
