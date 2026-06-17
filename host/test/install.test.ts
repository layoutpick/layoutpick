import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { nmManifest, nmManifestPath, PICK_COMMAND_MD, runInstall } from '../src/install'
import { NATIVE_HOST_NAME } from '../src/config'

describe('nmManifest', () => {
  test('has host name, binary path, stdio, allowed origin', () => {
    const m = nmManifest('/bin/layoutpick', 'abcd')
    expect(m.name).toBe(NATIVE_HOST_NAME)
    expect(m.path).toBe('/bin/layoutpick')
    expect(m.type).toBe('stdio')
    expect(m.allowed_origins).toEqual(['chrome-extension://abcd/'])
  })
})

describe('nmManifestPath', () => {
  test('points at Chrome NativeMessagingHosts', () => {
    const p = nmManifestPath('/Users/x')
    expect(p).toBe('/Users/x/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.layoutpick.host.json')
  })
})

describe('runInstall', () => {
  test('writes NM manifest + /pick command under a fake HOME', () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'home-'))
    runInstall('/opt/layoutpick/bin/layoutpick', { home, quiet: true })
    const nm = JSON.parse(fs.readFileSync(nmManifestPath(home), 'utf8'))
    expect(nm.path).toBe('/opt/layoutpick/bin/layoutpick')
    const cmd = fs.readFileSync(path.join(home, '.claude/commands/pick.md'), 'utf8')
    expect(cmd).toBe(PICK_COMMAND_MD)
    fs.rmSync(home, { recursive: true, force: true })
  })
})
