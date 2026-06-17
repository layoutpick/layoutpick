---
description: Pull your most recent LayoutPick element capture(s) into this session
allowed-tools: Bash(layoutpick:*)
---

Run `layoutpick latest --count $ARGUMENTS` (default 1 if no count given), then read each returned file path and treat the markdown + screenshot as the UI element(s) the user just selected in their browser. If the command reports no recent pick, tell the user to select an element in Chrome first (Alt+S).
