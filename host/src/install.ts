import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { LAYOUTPICK_EXT_ID, NATIVE_HOST_NAME, WEB_STORE_URL } from './config'

export interface NmManifest {
  name: string
  description: string
  path: string
  type: 'stdio'
  allowed_origins: string[]
}

export function nmManifest(binPath: string, extId: string): NmManifest {
  return {
    name: NATIVE_HOST_NAME,
    description: 'LayoutPick native host',
    path: binPath,
    type: 'stdio',
    allowed_origins: [`chrome-extension://${extId}/`],
  }
}

export function nmManifestPath(home = os.homedir()): string {
  return path.join(home, 'Library', 'Application Support', 'Google', 'Chrome', 'NativeMessagingHosts', `${NATIVE_HOST_NAME}.json`)
}

// The /pick slash command, bundled as a string so the compiled binary is
// self-contained. Runs `layoutpick latest` and reads the returned files.
export const PICK_COMMAND_MD = `---
description: Pull your most recent LayoutPick element capture(s) into this session
allowed-tools: Bash(layoutpick:*)
---

Run \`layoutpick latest --count $ARGUMENTS\` (default 1 if no count given), then read each returned file path and treat the markdown + screenshot as the UI element(s) the user just selected in their browser. If the command reports no recent pick, tell the user to select an element in Chrome first (Alt+S).
`

export interface InstallOpts { home?: string, quiet?: boolean }

export function runInstall(binPath: string, opts: InstallOpts = {}): void {
  const home = opts.home ?? os.homedir()
  const nmPath = nmManifestPath(home)
  fs.mkdirSync(path.dirname(nmPath), { recursive: true })
  fs.writeFileSync(nmPath, `${JSON.stringify(nmManifest(binPath, LAYOUTPICK_EXT_ID), null, 2)}\n`, 'utf8')

  const cmdPath = path.join(home, '.claude', 'commands', 'pick.md')
  fs.mkdirSync(path.dirname(cmdPath), { recursive: true })
  fs.writeFileSync(cmdPath, PICK_COMMAND_MD, 'utf8')

  if (!opts.quiet) {
    console.log('LayoutPick installed.')
    console.log(`  • native host → ${nmPath}`)
    console.log(`  • /pick command → ${cmdPath}`)
    console.log(`\nNext: add the extension from the Chrome Web Store:\n  ${WEB_STORE_URL}`)
    console.log('\nThen: pick an element in Chrome (Alt+S), switch to Claude Code, and run /pick.')
  }
}
