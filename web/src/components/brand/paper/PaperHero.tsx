// Exempt dir: native elements / inline style / literal colors / raw SVG allowed here.
"use client"
import dynamic from "next/dynamic"

// WebGL paper+deboss is client-only (canvas/WebGL is not SSR-safe).
const PaperDebossScene = dynamic(() => import("./PaperDebossScene"), { ssr: false })

const PICK = "#4c8dff"

export function PaperHero() {
  return (
    <div
      style={{
        // full-bleed, fixed 16:9 so the debossed wordmark keeps its proportions
        position: "relative",
        width: "100vw",
        left: "50%",
        marginLeft: "-50vw",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        backgroundColor: "#e3dbc6",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      }}
    >
      {/* the paper + debossed wordmark, rendered in WebGL */}
      <PaperDebossScene text="LayoutPick" />

      {/* the pick: a selection marquee over the debossed region (HTML overlay) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(50vw, 580px)",
          height: "min(13vw, 150px)",
        }}
      >
        {/* crisp 1px 4/3 dashed selection border */}
        <svg
          aria-hidden
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <rect
            x="0.5"
            y="0.5"
            width="calc(100% - 1px)"
            height="calc(100% - 1px)"
            fill="none"
            stroke={PICK}
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        </svg>

        {/* picker info chip */}
        <div
          style={{
            position: "absolute",
            top: -12,
            left: -1.5,
            transform: "translateY(-100%)",
            background: PICK,
            color: "#fff",
            fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
            fontSize: 11,
            lineHeight: 1,
            padding: "4px 6px",
            borderRadius: 3,
            whiteSpace: "nowrap",
          }}
        >
          main.hero · 612×128
        </div>

        {/* corner handles */}
        {(["nw", "ne", "sw", "se"] as const).map((c) => (
          <span
            key={c}
            aria-hidden
            style={{
              position: "absolute",
              width: 5,
              height: 5,
              background: "#fff",
              border: `1px solid ${PICK}`,
              top: c[0] === "n" ? -3 : undefined,
              bottom: c[0] === "s" ? -3 : undefined,
              left: c[1] === "w" ? -3 : undefined,
              right: c[1] === "e" ? -3 : undefined,
            }}
          />
        ))}

        {/* mono annotation — the clipped payload */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: -28,
            fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
            fontSize: 13,
            letterSpacing: 0.2,
            color: "#6f675b",
          }}
        >
          picked · sent to Claude Code
        </div>
      </div>
    </div>
  )
}
