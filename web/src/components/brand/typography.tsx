import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

const HEADING_CLASS: Record<1 | 2 | 3, string> = {
  1: "text-h1 font-semibold leading-tight tracking-tight text-text",
  2: "text-h2 font-semibold leading-snug text-text",
  3: "text-h3 font-semibold text-text",
}

export function Heading({
  level,
  as,
  className,
  children,
}: {
  level: 1 | 2 | 3
  as?: "h1" | "h2" | "h3" | "h4"
  className?: string
  children: ReactNode
}) {
  const Tag = as ?? (`h${level}` as const)
  return <Tag className={cn(HEADING_CLASS[level], className)}>{children}</Tag>
}

const TEXT_CLASS = {
  body: "text-body text-text",
  small: "text-small text-text",
  mono: "text-mono font-mono text-text",
} as const

export function Text({
  variant = "body",
  muted = false,
  as: Tag = "p",
  className,
  children,
}: {
  variant?: "body" | "small" | "mono"
  muted?: boolean
  as?: "p" | "span" | "div"
  className?: string
  children: ReactNode
}) {
  return (
    <Tag className={cn(TEXT_CLASS[variant], muted && "text-text-muted", className)}>
      {children}
    </Tag>
  )
}
