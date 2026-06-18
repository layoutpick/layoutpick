import { Container, Section, Stack } from "@/components/brand/layout"
import { Heading, Text } from "@/components/brand/typography"
import { PaperHero } from "@/components/brand/paper/PaperHero"

export default function PaperBrandPage() {
  return (
    <Container className="max-w-screen-lg">
      <Section>
        <Stack gap="xl">
          <Stack gap="sm">
            <Heading level={1}>Paper texture experiment</Heading>
            <Text muted>Real photographed paper. The blue marquee picks a piece of the page — like picking a DOM element.</Text>
          </Stack>
          <PaperHero />
        </Stack>
      </Section>
    </Container>
  )
}
