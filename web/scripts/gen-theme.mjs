// Generate the @theme token block in globals.css from src/lib/tokens.ts.
// Rewrites the region between the BEGIN/END markers so tokens never drift.
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const mod = await import(join(root, "src/lib/tokens.ts"))
const t = mod.tokens

const lines = ["@theme {"]
for (const [k, v] of Object.entries(t.color)) lines.push(`  --color-${kebab(k)}: ${v};`)
for (const [k, v] of Object.entries(t.type)) lines.push(`  --text-${kebab(k)}: ${v.size};`)
for (const [k, v] of Object.entries(t.space)) lines.push(`  --spacing-${k}: ${v};`)
for (const [k, v] of Object.entries(t.radius)) lines.push(`  --radius-token-${k}: ${v};`)
lines.push(`  --font-sans: ${t.font.sans};`)
lines.push(`  --font-mono: ${t.font.mono};`)
lines.push("}")

function kebab(s) { return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() }

const css = readFileSync(join(root, "src/app/globals.css"), "utf8")
const BEGIN = "/* BEGIN GENERATED TOKENS */"
const END = "/* END GENERATED TOKENS */"
const block = `${BEGIN}\n${lines.join("\n")}\n${END}`
const re = new RegExp(`${escape(BEGIN)}[\\s\\S]*?${escape(END)}`)
const next = re.test(css) ? css.replace(re, block) : `${block}\n\n${css}`
function escape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }
writeFileSync(join(root, "src/app/globals.css"), next)
console.log("globals.css @theme regenerated from tokens.ts")
