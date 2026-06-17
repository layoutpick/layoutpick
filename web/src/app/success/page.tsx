import type { Metadata } from "next";
import { Check } from "lucide-react";
import CopyCommand from "@/components/CopyCommand";
import { getStripe } from "@/lib/stripe";
import { Container, Section, Stack, Box } from "@/components/brand/layout";
import { Heading, Text } from "@/components/brand/typography";
import { Link } from "@/components/brand/link";

export const metadata: Metadata = {
  title: "Thanks for buying LayoutPick",
  robots: { index: false },
};

// Always render at request time — we verify the live Stripe session.
export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let paid = false;
  let email: string | null = null;

  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      paid = session.payment_status === "paid";
      email = session.customer_details?.email ?? null;
    } catch {
      paid = false;
    }
  }

  return (
    <Container className="max-w-xl">
      <Section>
        {paid ? (
          <Stack gap="md" align="center" className="text-center">
            <Box className="w-14 h-14 rounded-token-full bg-brand2/10 border border-brand2/30 flex items-center justify-center">
              <Check className="w-6 h-6 text-brand2" />
            </Box>
            <Heading level={1}>You&apos;re all set 🎉</Heading>
            <Text muted>
              Thanks for buying LayoutPick{email ? `, ${email}` : ""}. Run the installer below to register the
              native host and wire the{" "}
              <Text as="span" variant="mono" className="text-brand2">/pick</Text> command into Claude Code (macOS).
            </Text>
            <Text variant="small" muted>A receipt has been emailed to you.</Text>
            <Box className="w-full text-left">
              <CopyCommand />
            </Box>
            <Link href="https://chromewebstore.google.com/" variant="inline" target="_blank" rel="noopener noreferrer">
              Add the Chrome extension →
            </Link>
          </Stack>
        ) : (
          <Stack gap="md" align="center" className="text-center">
            <Heading level={1}>We couldn&apos;t verify your payment</Heading>
            <Text muted>
              If you were charged, your access is safe — please contact support with your receipt. Otherwise you
              can head back and try again.
            </Text>
            <Link href="/" variant="inline">← Back to LayoutPick</Link>
          </Stack>
        )}
      </Section>
    </Container>
  );
}
