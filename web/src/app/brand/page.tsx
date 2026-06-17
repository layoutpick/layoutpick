import { tokens } from "@/lib/tokens"
import { Container, Section, Stack, Row, Box } from "@/components/brand/layout"
import { Heading, Text } from "@/components/brand/typography"
import { Link } from "@/components/brand/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Static class maps — keys mirror tokens.color / tokens.type.
const SWATCH: Record<keyof typeof tokens.color, string> = {
  bg: "bg-bg", surface: "bg-surface", surface2: "bg-surface2", text: "bg-text",
  textMuted: "bg-text-muted", brand: "bg-brand", brand2: "bg-brand2", border: "bg-border",
}
const TYPE_CLASS: Record<keyof typeof tokens.type, string> = {
  display: "text-display font-semibold", h1: "text-h1 font-semibold", h2: "text-h2 font-semibold",
  h3: "text-h3 font-semibold", body: "text-body", small: "text-small", mono: "text-mono font-mono",
}

export default function BrandPage() {
  return (
    <Container className="max-w-screen-md">
      <Section>
        <Stack gap="xl">
          <Stack gap="sm">
            <Heading level={1}>LayoutPick design system</Heading>
            <Text muted>Every token and component the app is allowed to use.</Text>
          </Stack>

          {/* Colors */}
          <Stack gap="md">
            <Heading level={2}>Color</Heading>
            <Row gap="md">
              {(Object.keys(tokens.color) as (keyof typeof tokens.color)[]).map((name) => (
                <Card key={name} className="p-3 w-40">
                  <Stack gap="sm">
                    <Box className={`h-12 rounded-token-md border border-border ${SWATCH[name]}`}>{null}</Box>
                    <Text variant="small">{name}</Text>
                    <Text variant="mono" muted>{tokens.color[name]}</Text>
                  </Stack>
                </Card>
              ))}
            </Row>
          </Stack>

          <Separator />

          {/* Type scale */}
          <Stack gap="md">
            <Heading level={2}>Type scale</Heading>
            {(Object.keys(tokens.type) as (keyof typeof tokens.type)[]).map((step) => (
              <Row key={step} gap="lg" justify="between">
                <Text as="span" className={TYPE_CLASS[step]}>The quick brown fox</Text>
                <Text variant="mono" muted>{step} · {tokens.type[step].size}</Text>
              </Row>
            ))}
          </Stack>

          <Separator />

          {/* Components */}
          <Stack gap="md">
            <Heading level={2}>Components</Heading>
            <Row gap="md">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </Row>
            <Row gap="md">
              <Badge>Badge</Badge>
              <Link variant="inline" href="#">Inline link</Link>
              <Link variant="nav" href="#">Nav link</Link>
            </Row>
            <Card className="p-5 max-w-sm">
              <Stack gap="sm">
                <Heading level={3}>Card title</Heading>
                <Text muted>Cards, badges, separators, links — all themed from tokens.</Text>
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </Section>
    </Container>
  )
}
