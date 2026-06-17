// Routing for the layoutpick binary. Returns the action to take so it's unit
// testable; main() performs the side effects.
export type Action =
  | { kind: 'install' }
  | { kind: 'latest', count: number }
  | { kind: 'host' }

export function parseArgs(argv: string[]): Action {
  const cmd = argv[0]
  if (cmd === 'install')
    return { kind: 'install' }
  if (cmd === 'latest') {
    const i = argv.indexOf('--count')
    let count = 1
    if (i >= 0 && argv[i + 1])
      count = Number.parseInt(argv[i + 1], 10) || 1
    // also accept a bare positional count: `latest 3`
    else if (argv[1] && /^\d+$/.test(argv[1]))
      count = Number.parseInt(argv[1], 10)
    if (count < 1)
      count = 1
    return { kind: 'latest', count }
  }
  return { kind: 'host' }
}
