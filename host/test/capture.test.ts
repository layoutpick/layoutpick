import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { formatMarkdown, writeCapture, type PickedPayload } from '../src/capture'

let dir: string
beforeEach(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lp-')) })
afterEach(() => { fs.rmSync(dir, { recursive: true, force: true }) })

const payload: PickedPayload = {
  url: 'https://example.com', title: 'Example', selector: 'main > div', tag: 'div',
  id: 'hero', classes: ['card'], attributes: { role: 'banner' },
  rect: { x: 0, y: 0, width: 320, height: 100 }, styles: { color: 'rgb(0,0,0)' },
  text: 'Hello', outerHTML: '<div id="hero" class="card">Hello</div>',
}

describe('formatMarkdown', () => {
  test('includes selector, size, html', () => {
    const md = formatMarkdown(payload)
    expect(md).toContain('`main > div`')
    expect(md).toContain('320×100 px')
    expect(md).toContain('```html')
  })
})

describe('writeCapture', () => {
  test('writes md + png and returns paths', () => {
    const res = writeCapture({ inboxDir: dir, payload, png: Buffer.from('PNG') })
    expect(fs.existsSync(res.mdPath)).toBe(true)
    expect(res.pngPath && fs.existsSync(res.pngPath)).toBe(true)
    expect(path.basename(res.mdPath)).toMatch(/^element-.*\.md$/)
  })
  test('writes md only when png null', () => {
    const res = writeCapture({ inboxDir: dir, payload, png: null })
    expect(res.pngPath).toBeUndefined()
    expect(fs.existsSync(res.mdPath)).toBe(true)
  })
})
