// Exempt dir: native elements / inline style / literal colors / raw SVG allowed here.
"use client"
import type { CSSProperties, ReactNode } from "react"
import { PaperTexture } from "@paper-design/shaders-react"
import { EmbossedMark } from "./EmbossedMark"

// ---------------------------------------------------------------------------
// Deckle filter — a ragged torn-paper edge via feTurbulence displacement.
// One instance per page is enough; sheets reference it by id.
// ---------------------------------------------------------------------------
export function DeckleDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id="deckle-edge" x="-6%" y="-8%" width="112%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.016" numOctaves="3" seed="8" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="13" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="deckle-edge-soft" x="-6%" y="-8%" width="112%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.022" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// PaperSheet — a single sheet of paper with the WebGL fiber texture, a torn
// (deckled) edge, a contact shadow that follows the torn shape, and a tilt.
// Content is rendered OUTSIDE the filtered/​textured layer so text stays crisp.
// ---------------------------------------------------------------------------
export interface PaperSheetProps {
  width: number
  height: number
  rotate?: number
  back?: string
  front?: string
  fiber?: number
  crumples?: number
  folds?: number
  roughness?: number
  deckle?: "none" | "soft" | "torn"
  shadow?: string
  style?: CSSProperties
  children?: ReactNode
}

export function PaperSheet({
  width,
  height,
  rotate = 0,
  back = "#f4eede",
  front = "#d8cbac",
  fiber = 0.4,
  crumples = 0.35,
  folds = 0.12,
  roughness = 0.4,
  deckle = "torn",
  shadow = "0 18px 34px rgba(40,28,12,.42), 0 4px 10px rgba(40,28,12,.30)",
  style,
  children,
}: PaperSheetProps) {
  const deckleFilter =
    deckle === "torn" ? "url(#deckle-edge)" : deckle === "soft" ? "url(#deckle-edge-soft)" : "none"
  return (
    <div style={{ position: "relative", width, height, transform: `rotate(${rotate}deg)`, ...style }}>
      {/* textured sheet body — deckle + contact shadow follow the torn outline */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: back,
          filter: `${deckleFilter} drop-shadow(${shadow.split(",")[0]})`,
          overflow: "hidden",
        }}
      >
        <PaperTexture
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          colorBack={back}
          colorFront={front}
          fit="cover"
          scale={0.9}
          contrast={0.36}
          roughness={roughness}
          fiber={fiber}
          fiberSize={0.16}
          crumples={crumples}
          crumpleSize={0.32}
          folds={folds}
          foldCount={5}
          drops={0.12}
          seed={7}
        />
        {/* faint top-edge catch-light */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 14%)",
            mixBlendMode: "soft-light",
          }}
        />
      </div>
      {/* crisp content layer */}
      <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// RuledOverlay — faint blue notebook rules + a red margin line.
// ---------------------------------------------------------------------------
export function RuledOverlay({ lineGap = 30 }: { lineGap?: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: [
          `repeating-linear-gradient(180deg, transparent 0 ${lineGap - 1}px, rgba(70,110,170,.20) ${lineGap - 1}px ${lineGap}px)`,
          "linear-gradient(90deg, transparent 0 38px, rgba(200,70,70,.32) 38px 39px, transparent 39px)",
        ].join(", "),
        mixBlendMode: "multiply",
        pointerEvents: "none",
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Tape — a strip of semi-translucent matte tape with torn ends and a soft shadow.
// ---------------------------------------------------------------------------
export function Tape({
  width = 130,
  rotate = 0,
  style,
}: {
  width?: number
  rotate?: number
  style?: CSSProperties
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width,
        height: 38,
        transform: `rotate(${rotate}deg)`,
        background:
          "linear-gradient(180deg, rgba(225,215,180,.62) 0%, rgba(212,200,160,.55) 50%, rgba(225,215,180,.62) 100%)",
        boxShadow: "0 3px 7px rgba(40,28,12,.28)",
        // torn, slightly irregular ends
        clipPath:
          "polygon(3% 8%, 97% 0%, 99% 22%, 96% 46%, 99% 74%, 97% 100%, 4% 92%, 1% 70%, 3% 48%, 0% 24%)",
        mixBlendMode: "multiply",
        ...style,
      }}
    >
      {/* lengthwise sheen + faint horizontal striations */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(90deg, transparent 0 6px, rgba(255,255,255,.10) 6px 7px), linear-gradient(180deg, rgba(255,255,255,.28) 0%, transparent 40%)",
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// PaperScene — the full notebook/collage composition on a warm desk backdrop.
// ---------------------------------------------------------------------------
export interface PaperSceneProps {
  mode: "deboss" | "emboss"
  azimuth: number
  elevation: number
  bevel: number
  depth: number
  idSuffix: string
}

export function PaperScene({ mode, azimuth, elevation, bevel, depth, idSuffix }: PaperSceneProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: 660,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        overflow: "hidden",
        background:
          "radial-gradient(120% 120% at 50% 30%, #4a3d2c 0%, #342a1d 55%, #221a11 100%)",
      }}
    >
      <DeckleDefs />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='d'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23d)' opacity='0.35'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
          opacity: 0.5,
        }}
      />
      <div style={{ position: "relative", width: 640, height: 470 }}>
        <PaperSheet
          width={600}
          height={410}
          rotate={-3.5}
          back="#f2ecdb"
          front="#cdbf9f"
          folds={0.1}
          crumples={0.28}
          deckle="torn"
          style={{ position: "absolute", left: 12, top: 30 }}
        >
          <RuledOverlay lineGap={30} />
        </PaperSheet>
        <PaperSheet
          width={440}
          height={300}
          rotate={2.4}
          back="#f7f1e2"
          front="#ddd0b2"
          folds={0.14}
          crumples={0.32}
          deckle="torn"
          style={{ position: "absolute", left: 150, top: 110, zIndex: 3 }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
            }}
          >
            <EmbossedMark
              mode={mode}
              azimuth={azimuth}
              elevation={elevation}
              bevel={bevel}
              depth={depth}
              idSuffix={idSuffix}
            />
          </div>
        </PaperSheet>
        <PaperSheet
          width={140}
          height={130}
          rotate={-7}
          back="#f6e8a6"
          front="#e7d27f"
          folds={0.06}
          crumples={0.2}
          roughness={0.5}
          deckle="soft"
          shadow="0 10px 20px rgba(40,28,12,.4)"
          style={{ position: "absolute", left: 470, top: 320, zIndex: 4 }}
        />
        <Tape width={138} rotate={-26} style={{ left: 132, top: 96, zIndex: 5 }} />
        <Tape width={120} rotate={20} style={{ left: 470, top: 104, zIndex: 5 }} />
      </div>
    </div>
  )
}
