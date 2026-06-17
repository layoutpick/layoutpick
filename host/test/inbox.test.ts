import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { latest, refsFor, inboxDir, consumedDir } from '../src/inbox'

let base: string
beforeEach(() => { base = fs.mkdtempSync(path.join(os.tmpdir(), 'lpbase-')) })
afterEach(() => { fs.rmSync(base, { recursive: true, force: true }) })

function writeCapture(name: string, withPng = true) {
  const inbox = inboxDir(base)
  fs.mkdirSync(inbox, { recursive: true })
  fs.writeFileSync(path.join(inbox, `${name}.md`), '# md')
  if (withPng) fs.writeFileSync(path.join(inbox, `${name}.png`), 'png')
}

describe('latest', () => {
  test('empty inbox returns []', () => {
    expect(latest(base, 1)).toEqual([])
  })
  test('returns newest N and moves them to consumed', async () => {
    writeCapture('element-1'); await Bun.sleep(5)
    writeCapture('element-2'); await Bun.sleep(5)
    writeCapture('element-3')
    const got = latest(base, 2)
    expect(got.length).toBe(2)
    // newest first
    expect(got[0].mdPath).toContain('element-3')
    expect(got[1].mdPath).toContain('element-2')
    // moved to consumed, removed from inbox
    expect(fs.existsSync(path.join(inboxDir(base), 'element-3.md'))).toBe(false)
    expect(fs.existsSync(path.join(consumedDir(base), 'element-3.md'))).toBe(true)
    // element-1 still in inbox (not served)
    expect(fs.existsSync(path.join(inboxDir(base), 'element-1.md'))).toBe(true)
  })
  test('pairs png when present, omits when absent', () => {
    writeCapture('element-x', false)
    const got = latest(base, 1)
    expect(got[0].pngPath).toBeUndefined()
  })
  test('prunes consumed to most recent 50', async () => {
    for (let i = 0; i < 60; i++) { writeCapture(`element-${String(i).padStart(3,'0')}`, false); }
    // serve all 60 one-by-one so they move to consumed
    for (let i = 0; i < 60; i++) latest(base, 1)
    const consumedCount = fs.readdirSync(consumedDir(base)).filter(f => f.endsWith('.md')).length
    expect(consumedCount).toBeLessThanOrEqual(50)
  })
})

describe('refsFor', () => {
  test('builds @md + bare png absolute refs', () => {
    const s = refsFor([{ mdPath: '/a/element-1.md', pngPath: '/a/element-1.png' }])
    expect(s).toBe('@/a/element-1.md /a/element-1.png')
  })
  test('md only when no png', () => {
    expect(refsFor([{ mdPath: '/a/x.md' }])).toBe('@/a/x.md')
  })
  test('multiple captures space-joined', () => {
    expect(refsFor([{ mdPath: '/a/1.md' }, { mdPath: '/a/2.md' }])).toBe('@/a/1.md @/a/2.md')
  })
})
