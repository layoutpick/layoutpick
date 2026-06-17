import { describe, expect, test } from 'bun:test'
import { parseArgs } from '../src/cli'

describe('parseArgs', () => {
  test('install', () => { expect(parseArgs(['install'])).toEqual({ kind: 'install' }) })
  test('latest default count 1', () => { expect(parseArgs(['latest'])).toEqual({ kind: 'latest', count: 1 }) })
  test('latest --count N', () => { expect(parseArgs(['latest', '--count', '3'])).toEqual({ kind: 'latest', count: 3 }) })
  test('latest positional N', () => { expect(parseArgs(['latest', '2'])).toEqual({ kind: 'latest', count: 2 }) })
  test('latest clamps to >=1', () => { expect(parseArgs(['latest', '--count', '0'])).toEqual({ kind: 'latest', count: 1 }) })
  test('no args -> host', () => { expect(parseArgs([])).toEqual({ kind: 'host' }) })
  test('unknown -> host', () => { expect(parseArgs(['/path/to/manifest'])).toEqual({ kind: 'host' }) })
})
