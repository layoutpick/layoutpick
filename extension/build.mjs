#!/usr/bin/env node
// Builds extension/content-main.bundle.js by:
// 1. Extracting the PICKER_SOURCE template literal from picker-overlay.ts
// 2. Appending it (with eval) to content-main.js after the marker comment
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- Step 1: Extract PICKER_SOURCE from picker-overlay.ts ---
const overlayTs = readFileSync(join(__dirname, 'picker-overlay.ts'), 'utf8')

// Extract the backtick template literal assigned to PICKER_SOURCE
// It starts after `export const PICKER_SOURCE = \`` and ends at the final `\``
const match = overlayTs.match(/export const PICKER_SOURCE = `([\s\S]*?)`;?\s*$/)
if (!match) {
  console.error('ERROR: Could not find PICKER_SOURCE template literal in picker-overlay.ts')
  process.exit(1)
}
const pickerSource = match[1]

// --- Step 2: Read content-main.js and splice in the overlay ---
const contentMain = readFileSync(join(__dirname, 'content-main.js'), 'utf8')
const MARKER = '// --- PICKER_SOURCE appended below by build ---'

if (!contentMain.includes(MARKER)) {
  console.error(`ERROR: Marker not found in content-main.js: ${MARKER}`)
  process.exit(1)
}

// Replace the marker line with: const PICKER_SOURCE = `...`\neval(PICKER_SOURCE)
// We must escape any backticks inside the overlay source itself (there are none, but be safe)
const escapedSource = pickerSource.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')

const bundle = contentMain.replace(
  MARKER,
  `const PICKER_SOURCE = \`${escapedSource}\`\neval(PICKER_SOURCE)`
)

const outPath = join(__dirname, 'content-main.bundle.js')
writeFileSync(outPath, bundle, 'utf8')
console.log(`Built: ${outPath}`)
console.log(`  PICKER_SOURCE length: ${pickerSource.length} chars`)
