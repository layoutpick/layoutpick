import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type Base = { className?: string; children: ReactNode; id?: string }
type Gap = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"

const GAP: Record<Gap, string> = {
  xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-10", "2xl": "gap-16", "3xl": "gap-24",
}

export function Container({ className, children, id }: Base) {
  return <div id={id} className={cn("w-full max-w-[740px] mx-auto px-6", className)}>{children}</div>
}

export function Section({ className, children, id }: Base) {
  return <section id={id} className={cn("py-16", className)}>{children}</section>
}

export function Stack({
  gap = "md", align, justify, className, children, id,
}: Base & { gap?: Gap; align?: "start" | "center" | "end"; justify?: "start" | "center" | "between" }) {
  return (
    <div
      id={id}
      className={cn(
        "flex flex-col", GAP[gap],
        align && { start: "items-start", center: "items-center", end: "items-end" }[align],
        justify && { start: "justify-start", center: "justify-center", between: "justify-between" }[justify],
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Row({
  gap = "md", align = "center", justify, className, children, id,
}: Base & { gap?: Gap; align?: "start" | "center" | "end"; justify?: "start" | "center" | "between" }) {
  return (
    <div
      id={id}
      className={cn(
        "flex flex-row flex-wrap", GAP[gap],
        { start: "items-start", center: "items-center", end: "items-end" }[align],
        justify && { start: "justify-start", center: "justify-center", between: "justify-between" }[justify],
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Box({ className, children, id }: Base) {
  return <div id={id} className={cn(className)}>{children}</div>
}
