import CopyCommand from "@/components/CopyCommand"
import { Container, Section, Stack, Row, Box } from "@/components/brand/layout"
import { Heading, Text } from "@/components/brand/typography"
import { Link } from "@/components/brand/link"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Globe, GitFork } from "lucide-react"

export default function Home() {
  return (
    <Box className="flex flex-col min-h-screen">
      {/* Nav */}
      <Box className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md border-b border-border">
        <Container>
          <Row justify="between" className="h-14">
            <Link href="/" variant="muted" className="flex items-center gap-2 font-semibold text-text no-underline">
              <Box
                className="w-6 h-6 bg-accent rounded-token-sm flex items-center justify-center shrink-0"
               
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity=".9" />
                  <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity=".5" />
                  <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity=".5" />
                  <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity=".9" />
                </svg>
              </Box>
              LayoutPick
            </Link>
            <Row gap="lg" align="center">
              <Link href="#install" variant="nav">Install</Link>
              <Link href="#usage" variant="nav">Usage</Link>
              <Link href="https://github.com/layoutpick/layoutpick" variant="nav">GitHub</Link>
              {/* TODO: replace placeholder with real Chrome Web Store URL when published */}
              <Link href="https://chromewebstore.google.com/" variant="muted" target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "sm" })}>
                Add to Chrome
              </Link>
            </Row>
          </Row>
        </Container>
      </Box>

      {/* Main */}
      <Box className="flex-1">
        {/* Hero */}
        <Section className="py-24">
          <Container>
            <Stack gap="lg">
              <Badge className="self-start uppercase tracking-widest text-accent2 border-accent2/20 bg-accent2/10 rounded-token-full">
                <Box className="w-2 h-2 rounded-token-full bg-accent2 mr-2">{""}</Box>
                macOS · Chrome extension
              </Badge>

              <Heading level={1} className="text-h1 font-semibold tracking-tight leading-tight">
                Pick any element.
                <br />
                Send it to{" "}
                <Text as="span" className="text-accent">Claude Code</Text>.
              </Heading>

              <Text muted className="max-w-lg text-body leading-relaxed">
                Hover over any UI element in Chrome, press{" "}
                <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-accent2">
                  Alt+S
                </Text>
                , and LayoutPick captures a
                markdown description + screenshot — ready to drop into your{" "}
                <Text as="span" className="text-accent">Claude Code</Text> session with{" "}
                <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-accent2">
                  /pick
                </Text>
                .
              </Text>

              <Row gap="md">
                {/* TODO: replace placeholder with real Chrome Web Store URL when published */}
                <Link href="https://chromewebstore.google.com/" variant="muted" target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg" }) + " gap-2"}>
                  <Globe className="w-4 h-4" />
                  Add to Chrome
                </Link>
                <Link href="#install" variant="muted" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  Read the install guide →
                </Link>
              </Row>

              {/* Demo visual */}
              <Box className="mt-6 border border-border rounded-token-lg bg-surface overflow-hidden">
                <Row gap="sm" align="center" className="px-4 py-3 border-b border-border bg-surface2">
                  <Box className="w-2.5 h-2.5 rounded-token-full bg-red-400">{""}</Box>
                  <Box className="w-2.5 h-2.5 rounded-token-full bg-yellow-400">{""}</Box>
                  <Box className="w-2.5 h-2.5 rounded-token-full bg-green-400">{""}</Box>
                  <Text as="span" variant="mono" muted className="flex-1 text-center text-xs">
                    stripe.com/docs/payments
                  </Text>
                </Row>
                <Box className="p-6 grid grid-cols-2 gap-4 min-h-44">
                  <Box className="border border-accent rounded-token-md p-4 bg-accent/10 text-text-muted text-sm relative">
                    <Text as="span" variant="mono" className="absolute -top-3 left-3 text-xs text-accent bg-bg px-1">
                      Alt+S → click
                    </Text>
                    <Text as="span" className="text-xs font-medium text-accent uppercase tracking-widest block mb-1">
                      Captured
                    </Text>
                    <Text as="span" variant="small" muted>
                      Primary button · &quot;Pay now&quot; · rounded-full · bg-indigo-600 · 48px tall
                    </Text>
                  </Box>
                  <Box className="border border-border rounded-token-md p-4 text-sm text-text-muted">
                    <Text as="span" variant="small" muted>
                      Card component
                      <br />
                      Product grid
                      <br />
                      Nav link
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Container>
        </Section>

        <Separator />

        {/* How it works */}
        <Section id="how-it-works">
          <Container>
            <Stack gap="xl">
              <Stack gap="sm">
                <Text as="span" variant="small" className="text-accent font-semibold uppercase tracking-widest">
                  How it works
                </Text>
                <Heading level={2}>Three steps, zero friction</Heading>
                <Text muted className="max-w-md">
                  LayoutPick bridges the gap between what you see in the browser and what{" "}
                  <Text as="span" className="text-accent">Claude Code</Text> can act on.
                </Text>
              </Stack>

              <Stack className="gap-0">
                {/* Step 1 */}
                <Row gap="lg" align="start" className="py-7 border-b border-border">
                  <Box className="w-9 h-9 rounded-token-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </Box>
                  <Stack gap="xs">
                    <Heading level={3}>Pick an element</Heading>
                    <Text muted>
                      Press{" "}
                      <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-text-muted">
                        Alt+S
                      </Text>
                      {" "}(or click the LayoutPick toolbar button) to enter pick mode. Hover over any element on the
                      page — it highlights in blue. Click to capture it.
                    </Text>
                  </Stack>
                </Row>

                {/* Step 2 */}
                <Row gap="lg" align="start" className="py-7 border-b border-border">
                  <Box className="w-9 h-9 rounded-token-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </Box>
                  <Stack gap="xs">
                    <Heading level={3}>It lands in your inbox</Heading>
                    <Text muted>
                      LayoutPick writes a markdown description + full-resolution screenshot to your local pick
                      inbox. The extension sends it to the native host running on your Mac in milliseconds — no
                      cloud involved.
                    </Text>
                  </Stack>
                </Row>

                {/* Step 3 */}
                <Row gap="lg" align="start" className="py-7">
                  <Box className="w-9 h-9 rounded-token-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </Box>
                  <Stack gap="xs">
                    <Heading level={3}>
                      Run{" "}
                      <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-accent2">
                        /pick
                      </Text>
                      {" "}in{" "}
                      <Text as="span" className="text-accent">Claude Code</Text>
                    </Heading>
                    <Text muted>
                      Switch to your{" "}
                      <Text as="span" className="text-accent">Claude Code</Text>
                      {" "}session and run{" "}
                      <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-accent2">
                        /pick
                      </Text>
                      . The element description and screenshot are injected into the conversation automatically.
                      Pick several elements first?{" "}
                      <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-accent2">
                        /pick 3
                      </Text>
                      {" "}sends the last three at once.
                    </Text>
                  </Stack>
                </Row>
              </Stack>
            </Stack>
          </Container>
        </Section>

        <Separator />

        {/* Install */}
        <Section id="install">
          <Container>
            <Stack gap="xl">
              <Stack gap="sm">
                <Text as="span" variant="small" className="text-accent font-semibold uppercase tracking-widest">
                  Install
                </Text>
                <Heading level={2}>Up in two steps</Heading>
                <Text muted className="max-w-md">
                  The Chrome extension handles picking; the native installer wires up the{" "}
                  <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-accent2">
                    /pick
                  </Text>
                  {" "}command into{" "}
                  <Text as="span" className="text-accent">Claude Code</Text>.
                </Text>
              </Stack>

              <Stack gap="md">
                {/* Install Step 1 */}
                <Card className="overflow-hidden p-0 border-border">
                  <Row gap="md" align="center" className="px-5 py-4 bg-surface border-b border-border">
                    <Box className="w-6 h-6 rounded-token-full bg-accent text-white text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </Box>
                    <Heading level={3}>Add LayoutPick to Chrome</Heading>
                  </Row>
                  <Stack gap="md" className="p-5 bg-surface">
                    <Text muted variant="small">
                      Install the Chrome extension from the Web Store. It adds the pick overlay and the toolbar
                      button.
                    </Text>
                    <Box>
                      {/* TODO: replace placeholder with real Chrome Web Store URL when published */}
                      <Link href="https://chromewebstore.google.com/" variant="muted" target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" }) + " gap-2"}>
                        <Globe className="w-4 h-4 text-accent" />
                        Chrome Web Store →
                      </Link>
                    </Box>
                  </Stack>
                </Card>

                {/* Install Step 2 */}
                <Card className="overflow-hidden p-0 border-border">
                  <Row gap="md" align="center" className="px-5 py-4 bg-surface border-b border-border">
                    <Box className="w-6 h-6 rounded-token-full bg-accent text-white text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </Box>
                    <Heading level={3}>Run the installer</Heading>
                  </Row>
                  <Stack gap="md" className="p-5 bg-surface">
                    <Text muted variant="small">
                      This registers the native host and wires up the{" "}
                      <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-accent2">
                        /pick
                      </Text>
                      {" "}slash command in{" "}
                      <Text as="span" className="text-accent">Claude Code</Text>. macOS only.
                    </Text>
                    <CopyCommand />
                  </Stack>
                </Card>
              </Stack>
            </Stack>
          </Container>
        </Section>

        <Separator />

        {/* Usage */}
        <Section id="usage">
          <Container>
            <Stack gap="xl">
              <Stack gap="sm">
                <Text as="span" variant="small" className="text-accent font-semibold uppercase tracking-widest">
                  Using LayoutPick
                </Text>
                <Heading level={2}>Quick reference</Heading>
                <Text muted>Everything you need once it&apos;s installed.</Text>
              </Stack>

              <Box className="grid grid-cols-2 gap-4">
                <Card className="p-5 border-border bg-surface">
                  <Stack gap="sm">
                    <Text as="span" className="text-xl">🖱</Text>
                    <Heading level={3}>Pick an element</Heading>
                    <Text muted variant="small">
                      Press{" "}
                      <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-text-muted">
                        Alt+S
                      </Text>
                      {" "}or click the toolbar icon to enter pick mode. Hover to preview, click to capture. Press{" "}
                      <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-text-muted">
                        Esc
                      </Text>
                      {" "}to cancel.
                    </Text>
                  </Stack>
                </Card>

                <Card className="p-5 border-border bg-surface">
                  <Stack gap="sm">
                    <Text as="span" className="text-xl">⚡</Text>
                    <Heading level={3}>
                      Send to{" "}
                      <Text as="span" className="text-accent">Claude Code</Text>
                    </Heading>
                    <Text muted variant="small">
                      In{" "}
                      <Text as="span" className="text-accent">Claude Code</Text>, run{" "}
                      <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-accent2">
                        /pick
                      </Text>
                      {" "}to inject the last captured element — markdown + screenshot — into the current conversation.
                    </Text>
                  </Stack>
                </Card>

                <Card className="p-5 border-border bg-surface">
                  <Stack gap="sm">
                    <Text as="span" className="text-xl">📦</Text>
                    <Heading level={3}>Send multiple</Heading>
                    <Text muted variant="small">
                      Pick several elements in a row, then run{" "}
                      <Text as="span" variant="mono" className="bg-surface2 border border-border rounded-token-sm px-1 text-accent2">
                        /pick 3
                      </Text>
                      {" "}(or any number) to send the last <em>n</em> captures at once.
                    </Text>
                  </Stack>
                </Card>

                <Card className="p-5 border-border bg-surface">
                  <Stack gap="sm">
                    <Text as="span" className="text-xl">🔌</Text>
                    <Heading level={3}>No cloud required</Heading>
                    <Text muted variant="small">
                      Everything stays local. The extension talks to the native host via Chrome&apos;s native
                      messaging API — no data leaves your machine.
                    </Text>
                  </Stack>
                </Card>
              </Box>
            </Stack>
          </Container>
        </Section>
      </Box>

      {/* Footer */}
      <Box className="border-t border-border py-9">
        <Container>
          <Row justify="between" gap="md">
            <Row gap="md" align="center">
              <Text as="span" variant="small" muted className="font-semibold">LayoutPick</Text>
              <Badge variant="outline" className="text-xs rounded-token-full border-border text-text-muted">
                macOS + Chrome
              </Badge>
            </Row>
            <Row gap="lg" align="center">
              <Link
                href="https://github.com/layoutpick/layoutpick"
                target="_blank"
                rel="noopener noreferrer"
                variant="muted"
                className="flex items-center gap-1 text-xs"
              >
                <GitFork className="w-3.5 h-3.5" />
                GitHub
              </Link>
              {/* TODO: replace placeholder with real Chrome Web Store URL when published */}
              <Link
                href="https://chromewebstore.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                variant="muted"
                className="text-xs"
              >
                Chrome Extension
              </Link>
            </Row>
          </Row>
        </Container>
      </Box>
    </Box>
  )
}
