import NextLink, { type LinkProps } from "next/link"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

const VARIANT = {
  nav: "text-small text-text-muted hover:text-text transition-colors no-underline",
  inline: "text-brand hover:underline underline-offset-4",
  muted: "text-text-muted hover:text-text transition-colors no-underline",
} as const

export function Link({
  variant = "inline",
  className,
  children,
  ...props
}: LinkProps & {
  variant?: "nav" | "inline" | "muted"
  className?: string
  children: ReactNode
  target?: string
  rel?: string
}) {
  return (
    <NextLink className={cn(VARIANT[variant], className)} {...props}>
      {children}
    </NextLink>
  )
}
