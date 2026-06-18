// Exempt dir.
import { PaperFilters, paperFilterId, type PaperFiltersProps } from "./paper-filters"

export interface EmbossedMarkProps extends Omit<PaperFiltersProps, never> {
  text?: string
}

export function EmbossedMark({ mode, azimuth, elevation, bevel, depth, idSuffix, text = "LayoutPick" }: EmbossedMarkProps) {
  return (
    <>
      <PaperFilters mode={mode} azimuth={azimuth} elevation={elevation} bevel={bevel} depth={depth} idSuffix={idSuffix} />
      <svg viewBox="0 0 620 130" width="100%" role="img" aria-label={text}>
        {/* Blind deboss: the letters are filled with the paper tone, so all definition
            comes from the relief lighting — the mark reads as pressed INTO the sheet,
            not as a separate coloured object sitting on top. */}
        <text
          x="310"
          y="92"
          textAnchor="middle"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontWeight="800"
          letterSpacing="-1"
          fontSize="78"
          fill="#f1ebdd"
          filter={`url(#${paperFilterId(idSuffix)})`}
        >
          {text}
        </text>
      </svg>
    </>
  )
}
