// Exempt dir.
import { PaperFilters, paperFilterId, type PaperFiltersProps } from "./paper-filters"

export interface EmbossedMarkProps extends Omit<PaperFiltersProps, never> {
  text?: string
}

export function EmbossedMark({ mode, azimuth, elevation, bevel, depth, idSuffix, text = "LayoutPick" }: EmbossedMarkProps) {
  return (
    <>
      <PaperFilters mode={mode} azimuth={azimuth} elevation={elevation} bevel={bevel} depth={depth} idSuffix={idSuffix} />
      <svg viewBox="0 0 600 120" width="100%" role="img" aria-label={text}>
        <text
          x="300"
          y="84"
          textAnchor="middle"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontWeight="700"
          fontSize="72"
          fill="#d8cba8"
          filter={`url(#${paperFilterId(idSuffix)})`}
        >
          {text}
        </text>
      </svg>
    </>
  )
}
