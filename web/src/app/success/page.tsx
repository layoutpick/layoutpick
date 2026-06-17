import type { Metadata } from "next";
import CopyCommand from "@/components/CopyCommand";
import { getStripe } from "@/lib/stripe";

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
    <main style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "560px", textAlign: "center" }}>
        {paid ? (
          <>
            <div
              aria-hidden="true"
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 24px",
                borderRadius: "50%",
                background: "rgba(56,201,176,.12)",
                border: "1px solid rgba(56,201,176,.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#38c9b0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 600, color: "#fff", marginBottom: "12px", letterSpacing: "-.02em" }}>
              You&apos;re all set 🎉
            </h1>
            <p style={{ fontSize: "1rem", color: "#7b8299", lineHeight: 1.7, marginBottom: "8px" }}>
              Thanks for buying LayoutPick{email ? `, ${email}` : ""}. Run the installer below to register the
              native host and wire the <code style={{ color: "#38c9b0" }}>/pick</code> command into Claude Code
              (macOS).
            </p>
            <p style={{ fontSize: ".85rem", color: "#454d66", marginBottom: "28px" }}>
              A receipt has been emailed to you.
            </p>
            <div style={{ textAlign: "left", marginBottom: "28px" }}>
              <CopyCommand />
            </div>
            <a
              href="https://chromewebstore.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "14px", color: "#4c8dff", textDecoration: "none" }}
            >
              Add the Chrome extension →
            </a>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>
              We couldn&apos;t verify your payment
            </h1>
            <p style={{ fontSize: "1rem", color: "#7b8299", lineHeight: 1.7, marginBottom: "28px" }}>
              If you were charged, your access is safe — please contact support with your receipt. Otherwise you
              can head back and try again.
            </p>
            <a href="/" style={{ fontSize: "14px", color: "#4c8dff", textDecoration: "none" }}>
              ← Back to LayoutPick
            </a>
          </>
        )}
      </div>
    </main>
  );
}
