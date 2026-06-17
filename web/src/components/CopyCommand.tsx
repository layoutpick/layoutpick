"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Row, Box } from "@/components/brand/layout"
import { Text } from "@/components/brand/typography"
import { Button } from "@/components/ui/button"

const COMMAND = "curl -fsSL https://layoutpick.com/install.sh | sh"

export default function CopyCommand() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(COMMAND).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Row
      gap="sm"
      align="center"
      justify="between"
      className="bg-bg border border-border rounded-token-md px-4 py-3 overflow-x-auto"
    >
      <Box className="flex-1 overflow-x-auto">
        <Text variant="mono" className="text-brand2 whitespace-nowrap">
          {COMMAND}
        </Text>
      </Box>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        aria-label="Copy install command"
        className={copied ? "text-brand2" : "text-text-muted"}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </Row>
  )
}
