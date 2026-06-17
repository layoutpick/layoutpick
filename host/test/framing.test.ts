import { describe, expect, test } from 'bun:test'
import { encodeMessage, FrameReader } from '../src/framing'

describe('framing', () => {
  test('encodes length-prefixed frame', () => {
    const buf = encodeMessage({ ok: true })
    expect(buf.readUInt32LE(0)).toBe(buf.length - 4)
    expect(JSON.parse(buf.subarray(4).toString('utf8'))).toEqual({ ok: true })
  })
  test('reassembles split message', () => {
    const frame = encodeMessage({ hello: 'world' })
    const r = new FrameReader(); const got: any[] = []
    r.push(frame.subarray(0, 3), m => got.push(m))
    r.push(frame.subarray(3), m => got.push(m))
    expect(got).toEqual([{ hello: 'world' }])
  })
})
