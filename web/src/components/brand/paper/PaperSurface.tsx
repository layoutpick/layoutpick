// Exempt dir: native elements / inline style / literal colors allowed here.
"use client"
import type { ReactNode } from "react"
import { PaperTexture } from "@paper-design/shaders-react"

export interface PaperSurfaceProps {
  fiber: number // curly directional fiber intensity (0–1)
  crumples: number // cell-based crumple/mottle intensity (0–1)
  folds: number // depth of fold/crease lines (0–1)
  roughness: number // fine pixel grain (0–1)
  children: ReactNode
  className?: string
}

// Warm cream stock. colorBack is the base sheet tone; colorFront is the darker
// fiber/fold detail the shader paints into it.
const PAPER_BACK = "#efe8d8"
const PAPER_FRONT = "#cabd9f"

export function PaperSurface({ fiber, crumples, folds, roughness, children, className }: PaperSurfaceProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        borderRadius: 5,
        padding: "0 56px",
        minHeight: 560,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: PAPER_BACK,
        boxShadow: [
          "0 1px 1px rgba(60,45,20,.05)",
          "0 3px 6px rgba(60,45,20,.07)",
          "0 10px 24px rgba(60,45,20,.10)",
          "0 22px 50px rgba(60,45,20,.12)",
          "inset 0 1px 0 rgba(255,255,255,.5)",
        ].join(", "),
      }}
    >
      {/* The WebGL paper texture fills the sheet behind the content. */}
      <PaperTexture
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
        colorBack={PAPER_BACK}
        colorFront={PAPER_FRONT}
        fit="cover"
        scale={0.95}
        contrast={0.38}
        roughness={roughness}
        fiber={fiber}
        fiberSize={0.15}
        crumples={crumples}
        crumpleSize={0.34}
        folds={folds}
        foldCount={5}
        drops={0.12}
        seed={7}
      />
      {/* edge vignette — paper sits in slightly shadowed surroundings */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(130% 130% at 50% 38%, rgba(255,253,247,0.18) 0%, rgba(120,95,50,0) 50%, rgba(85,65,32,0.16) 100%)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 720 }}>{children}</div>
    </div>
  )
}
