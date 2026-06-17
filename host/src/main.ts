#!/usr/bin/env bun
import process from 'node:process'
import { writeCapture, type PickedPayload } from './capture'
import { FrameReader, encodeMessage } from './framing'
import { baseDir, inboxDir, latest, refsFor } from './inbox'
import { runInstall } from './install'
import { parseArgs } from './cli'

function selfPath(): string {
  // The compiled binary's own path; fall back to argv for `bun run`.
  return process.execPath.includes('layoutpick') ? process.execPath : (Bun.argv[1] ?? process.execPath)
}

function runHost(): void {
  const reader = new FrameReader()
  process.stdin.on('data', (chunk: Buffer) => {
    reader.push(chunk, (msg: { payload: PickedPayload, pngBase64?: string | null }) => {
      try {
        const png = msg.pngBase64 ? Buffer.from(msg.pngBase64, 'base64') : null
        const res = writeCapture({ inboxDir: inboxDir(), payload: msg.payload, png })
        const name = res.mdPath.split('/').pop()
        process.stdout.write(encodeMessage({ ok: true, message: `captured ${name}${res.pngPath ? ' + screenshot' : ''}` }))
      }
      catch (err: any) {
        process.stdout.write(encodeMessage({ ok: false, message: String(err?.message ?? err) }))
      }
    })
  })
  process.stdin.on('end', () => process.exit(0))
}

function main(): void {
  const action = parseArgs(Bun.argv.slice(2))
  if (action.kind === 'install') {
    runInstall(selfPath())
    return
  }
  if (action.kind === 'latest') {
    const caps = latest(baseDir(), action.count)
    if (!caps.length) {
      console.error('No recent pick — select an element in Chrome first (Alt+S).')
      process.exit(1)
    }
    console.log(refsFor(caps))
    return
  }
  runHost()
}

main()
