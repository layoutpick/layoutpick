// web/src/components/brand/paper/paper-filters.tsx
// Exempt dir: raw SVG / filter primitives are allowed here.
export function paperFilterId(idSuffix: string): string {
  return `paper-relief-${idSuffix}`
}

export interface PaperFiltersProps {
  mode: "deboss" | "emboss"
  azimuth: number
  elevation: number
  bevel: number // feGaussianBlur stdDeviation — bevel softness
  depth: number // surfaceScale — relief depth
  idSuffix: string // changed on tune to force filter re-eval (Safari cache trick)
}

export function PaperFilters({ mode, azimuth, elevation, bevel, depth, idSuffix }: PaperFiltersProps) {
  // Deboss = light from above casts shadow INSIDE letters (pressed in).
  // Emboss = invert the light azimuth so letters appear raised.
  const azi = mode === "emboss" ? (azimuth + 180) % 360 : azimuth
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id={paperFilterId(idSuffix)} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          {/* 1. mark alpha is the height map; 2. blur it into a bevel ramp */}
          <feGaussianBlur in="SourceAlpha" stdDeviation={bevel} result="ramp" />
          {/* 3. broad diffuse relief */}
          <feDiffuseLighting in="ramp" surfaceScale={depth} diffuseConstant="1" lightingColor="#ffffff" result="diffuse">
            <feDistantLight azimuth={azi} elevation={elevation} />
          </feDiffuseLighting>
          {/* multiply diffuse over the original mark color so it tints the relief */}
          <feComposite in="diffuse" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="diffuseShaded" />
          {/* 4. specular catch-light on the lip */}
          <feSpecularLighting in="ramp" surfaceScale={depth} specularConstant="0.8" specularExponent="18" lightingColor="#ffffff" result="spec">
            <feDistantLight azimuth={azi} elevation={elevation} />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specClipped" />
          {/* 5. combine shaded relief + highlight */}
          <feBlend in="diffuseShaded" in2="specClipped" mode="screen" />
        </filter>
      </defs>
    </svg>
  )
}
