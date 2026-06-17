import * as fs from 'node:fs'
import * as path from 'node:path'

export interface PickedPayload {
  url: string
  title?: string
  selector: string
  tag: string
  id?: string
  classes?: string[]
  attributes?: Record<string, string>
  rect?: { x: number, y: number, width: number, height: number }
  styles?: Record<string, string>
  text?: string
  outerHTML?: string
}

export function formatMarkdown(p: PickedPayload): string {
  const lines: string[] = ['# UI element capture', '']
  lines.push(`- **Source:** ${p.url}`)
  if (p.title)
    lines.push(`- **Page title:** ${p.title}`)
  lines.push(`- **Selector:** \`${p.selector}\``)

  let ident = `- **Tag:** \`${p.tag}\``
  if (p.id)
    ident += ` · **id:** \`${p.id}\``
  if (p.classes && p.classes.length)
    ident += ` · **classes:** \`${p.classes.join(' ')}\``
  lines.push(ident)

  if (p.rect)
    lines.push(`- **Size:** ${Math.round(p.rect.width)}×${Math.round(p.rect.height)} px`)

  if (p.text)
    lines.push('', '**Text:**', '', `> ${String(p.text).replace(/\n/g, '\n> ')}`, '')

  if (p.attributes && Object.keys(p.attributes).length) {
    lines.push('', '**Attributes:**', '')
    for (const [k, v] of Object.entries(p.attributes))
      lines.push(`- \`${k}\`: \`${v}\``)
    lines.push('')
  }

  if (p.styles && Object.keys(p.styles).length) {
    lines.push('', '**Key computed styles:**', '', '```css')
    for (const [k, v] of Object.entries(p.styles))
      lines.push(`${k}: ${v};`)
    lines.push('```', '')
  }

  if (p.outerHTML)
    lines.push('', '**HTML:**', '', '```html', p.outerHTML, '```', '')

  return lines.join('\n')
}

export interface WriteCaptureArgs { inboxDir: string, payload: PickedPayload, png: Buffer | null }
export interface WriteCaptureResult { mdPath: string, pngPath?: string }

export function writeCapture(args: WriteCaptureArgs): WriteCaptureResult {
  const { inboxDir, payload, png } = args
  fs.mkdirSync(inboxDir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, '-').replace(/-?Z$/, '')
  const mdPath = path.join(inboxDir, `element-${ts}.md`)
  fs.writeFileSync(mdPath, formatMarkdown(payload), 'utf8')
  const result: WriteCaptureResult = { mdPath }
  if (png && png.length) {
    const pngPath = path.join(inboxDir, `element-${ts}.png`)
    fs.writeFileSync(pngPath, png)
    result.pngPath = pngPath
  }
  return result
}
