// Exempt dir: native elements / inline style / literal colors allowed here.
import type { ReactNode } from "react"

export interface PaperSurfaceProps {
  grainFrequency: number // feTurbulence baseFrequency (~0.8 for fine grain)
  grainOpacity: number // 0–1, ~0.05 for realism
  children: ReactNode
  className?: string
}

const PAPER_BASE = "#f4ecd8"

function grainDataUri(frequency: number, opacity: number): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${opacity}'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export function PaperSurface({ grainFrequency, grainOpacity, children, className }: PaperSurfaceProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: PAPER_BASE,
        backgroundImage: `radial-gradient(120% 120% at 30% 20%, #faf4e6 0%, #efe5cf 60%, #e8ddc4 100%), ${grainDataUri(grainFrequency, grainOpacity)}`,
        backgroundBlendMode: "multiply, multiply",
        borderRadius: 4,
        padding: "64px 48px",
        boxShadow:
          "0 1px 1px rgba(60,45,20,.04), 0 2px 2px rgba(60,45,20,.04), 0 4px 8px rgba(60,45,20,.06), 0 8px 16px rgba(60,45,20,.08), inset 0 0 0 1px rgba(255,255,255,.4)",
      }}
    >
      {children}
    </div>
  )
}
