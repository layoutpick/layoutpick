// web/src/components/brand/paper/paper-filters.tsx
// Exempt dir: raw SVG / filter primitives are allowed here.
export function paperFilterId(idSuffix: string): string {
  return `paper-relief-${idSuffix}`
}

export interface PaperFiltersProps {
  mode: "deboss" | "emboss"
  azimuth: number // light direction in degrees (225 = top-left)
  elevation: number // light height — scales how soft/strong the shading reads
  bevel: number // edge blur (feGaussianBlur stdDeviation) — softness of the relief
  depth: number // offset magnitude in px — how deep the relief reads
  idSuffix: string // changed on tune to force filter re-eval (Safari cache trick)
}

// Letterpress relief. The mark alpha is offset two ways: a light copy and a dark
// copy, peeking out from under the actual (paper-toned) glyphs on opposite edges.
// Emboss = highlight on the lit edge (raised); deboss = highlight on the far edge
// (pressed in). Offset direction comes from the light azimuth; elevation lowers the
// contrast as the light gets steeper; bevel blurs the fringe.
export function PaperFilters({ mode, azimuth, elevation, bevel, depth, idSuffix }: PaperFiltersProps) {
  const rad = (azimuth * Math.PI) / 180
  // Light vector in screen space (y points down). az 225 → top-left.
  const lx = Math.cos(rad)
  const ly = Math.sin(rad)
  // Highlight sits on the lit edge for emboss, the opposite edge for deboss.
  const sign = mode === "emboss" ? 1 : -1
  const hlDx = +(lx * depth * sign).toFixed(3)
  const hlDy = +(ly * depth * sign).toFixed(3)
  const shDx = -hlDx
  const shDy = -hlDy
  // Steeper light (higher elevation) = flatter, gentler relief.
  const contrast = Math.max(0.15, Math.cos((elevation * Math.PI) / 180))
  const hlOpacity = +(0.9 * contrast).toFixed(3)
  const shOpacity = +(0.85 * contrast).toFixed(3)

  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id={paperFilterId(idSuffix)} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          {/* bottom/far highlight — white, offset, blurred, clipped to the glyph shape */}
          <feFlood floodColor="#ffffff" floodOpacity={hlOpacity} result="hlFlood" />
          <feComposite in="hlFlood" in2="SourceAlpha" operator="in" result="hlShape" />
          <feOffset in="hlShape" dx={hlDx} dy={hlDy} result="hlOffRaw" />
          <feGaussianBlur in="hlOffRaw" stdDeviation={bevel} result="hlOff" />

          {/* top/near shadow — warm dark, offset the other way */}
          <feFlood floodColor="#4a3a1c" floodOpacity={shOpacity} result="shFlood" />
          <feComposite in="shFlood" in2="SourceAlpha" operator="in" result="shShape" />
          <feOffset in="shShape" dx={shDx} dy={shDy} result="shOffRaw" />
          <feGaussianBlur in="shOffRaw" stdDeviation={bevel} result="shOff" />

          {/* stack: highlight, then shadow, then the paper-toned glyphs on top */}
          <feMerge>
            <feMergeNode in="hlOff" />
            <feMergeNode in="shOff" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}
