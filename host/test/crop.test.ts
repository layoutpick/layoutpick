import { describe, expect, test } from 'bun:test'
import { cropBox } from '../src/crop'

describe('cropBox', () => {
  test('scales by dpr', () => {
    expect(cropBox({ x: 10, y: 20, width: 100, height: 50 }, 2, { w: 800, h: 600 })).toEqual({ x: 20, y: 40, w: 200, h: 100 })
  })
  test('clamps to image bounds', () => {
    const b = cropBox({ x: 790, y: 0, width: 100, height: 50 }, 1, { w: 800, h: 600 })
    expect(b.x + b.w).toBeLessThanOrEqual(800)
  })
  test('no negative origin', () => {
    const b = cropBox({ x: -30, y: -10, width: 100, height: 50 }, 1, { w: 800, h: 600 })
    expect(b.x).toBe(0); expect(b.y).toBe(0)
  })
})
