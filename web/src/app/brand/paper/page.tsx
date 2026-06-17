"use client"
import { useState } from "react"
import { Container, Section, Stack } from "@/components/brand/layout"
import { Heading, Text } from "@/components/brand/typography"
import { PaperSurface } from "@/components/brand/paper/PaperSurface"
import { EmbossedMark } from "@/components/brand/paper/EmbossedMark"
import { PaperControls, type PaperParams } from "@/components/brand/paper/PaperControls"

const INITIAL: PaperParams = {
  mode: "deboss", azimuth: 225, elevation: 45, bevel: 1.6, depth: 2,
  grainFrequency: 0.8, grainOpacity: 0.05,
}

export default function PaperBrandPage() {
  const [params, setParams] = useState<PaperParams>(INITIAL)
  // idSuffix changes whenever relief params change → fresh filter id (Safari re-eval).
  const idSuffix = `${params.mode}-${params.azimuth}-${params.elevation}-${params.bevel}-${params.depth}`
  return (
    <Container className="max-w-screen-md">
      <Section>
        <Stack gap="xl">
          <Stack gap="sm">
            <Heading level={1}>Paper texture experiment</Heading>
            <Text muted>Debossed LayoutPick wordmark — procedural grain + SVG lighting relief.</Text>
          </Stack>
          <PaperSurface grainFrequency={params.grainFrequency} grainOpacity={params.grainOpacity}>
            <EmbossedMark
              mode={params.mode}
              azimuth={params.azimuth}
              elevation={params.elevation}
              bevel={params.bevel}
              depth={params.depth}
              idSuffix={idSuffix}
            />
          </PaperSurface>
          <PaperControls value={params} onChange={setParams} />
        </Stack>
      </Section>
    </Container>
  )
}
