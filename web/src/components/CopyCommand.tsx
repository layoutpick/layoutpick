"use client";

import { useState } from "react";

const COMMAND = "curl -fsSL https://layoutpick.com/install.sh | sh";

export default function CopyCommand() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(COMMAND).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      style={{
        position: "relative",
        background: "#0a0c11",
        border: "1px solid #252a38",
        borderRadius: "6px",
        padding: "16px 72px 16px 18px",
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: "14px",
        color: "#38c9b0",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
    >
      {COMMAND}
      <button
        onClick={handleCopy}
        aria-label="Copy install command"
        style={{
          position: "absolute",
          top: "50%",
          right: "12px",
          transform: "translateY(-50%)",
          background: "#1a1e28",
          border: `1px solid ${copied ? "rgba(56,201,176,.4)" : "#252a38"}`,
          borderRadius: "5px",
          color: copied ? "#38c9b0" : "#7b8299",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "11px",
          fontWeight: 500,
          padding: "4px 10px",
          cursor: "pointer",
          transition: "color .15s, border-color .15s",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
