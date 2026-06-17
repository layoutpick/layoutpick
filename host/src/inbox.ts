// Inbox lifecycle for layoutpick captures. The host writes element-<ts>.{md,png}
// to <base>/inbox; `layoutpick latest` serves the newest N (moving them to
// <base>/consumed so they aren't re-served) and prunes consumed to a cap.
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

const CONSUMED_CAP = 50

export function baseDir(): string {
  return path.join(os.homedir(), '.layoutpick')
}
export function inboxDir(base = baseDir()): string {
  return path.join(base, 'inbox')
}
export function consumedDir(base = baseDir()): string {
  return path.join(base, 'consumed')
}

export interface Capture { mdPath: string, pngPath?: string }

function mdsByNewest(dir: string): string[] {
  let names: string[]
  try { names = fs.readdirSync(dir) }
  catch { return [] }
  return names
    .filter(n => n.startsWith('element-') && n.endsWith('.md'))
    .map(n => path.join(dir, n))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)
}

function pruneConsumed(dir: string) {
  const mds = mdsByNewest(dir)
  for (const md of mds.slice(CONSUMED_CAP)) {
    for (const f of [md, md.replace(/\.md$/, '.png')]) {
      try { fs.unlinkSync(f) }
      catch {}
    }
  }
}

// Serve the newest `count` captures: pair each md with its sibling png, MOVE
// both into consumed, prune consumed, and return the consumed (new) paths,
// newest first.
export function latest(base = baseDir(), count = 1): Capture[] {
  const inbox = inboxDir(base)
  const consumed = consumedDir(base)
  fs.mkdirSync(consumed, { recursive: true })
  const picked = mdsByNewest(inbox).slice(0, count)
  const out: Capture[] = []
  for (const srcMd of picked) {
    const baseName = path.basename(srcMd)
    const destMd = path.join(consumed, baseName)
    fs.renameSync(srcMd, destMd)
    const cap: Capture = { mdPath: destMd }
    const srcPng = srcMd.replace(/\.md$/, '.png')
    if (fs.existsSync(srcPng)) {
      const destPng = destMd.replace(/\.md$/, '.png')
      fs.renameSync(srcPng, destPng)
      cap.pngPath = destPng
    }
    out.push(cap)
  }
  pruneConsumed(consumed)
  return out
}

// Build the prompt-injectable refs: md as an @-ref, png as a bare path (matches
// the prototype's terminal-paste format). Absolute paths so /pick works from
// any cwd.
export function refsFor(captures: Capture[]): string {
  return captures
    .map(c => (c.pngPath ? `@${c.mdPath} ${c.pngPath}` : `@${c.mdPath}`))
    .join(' ')
}
