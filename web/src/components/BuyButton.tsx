"use client";

import { useState } from "react";

export default function BuyButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return; // keep the loading state through the redirect
      }
      alert(data.error ?? "Something went wrong starting checkout.");
    } catch {
      alert("Could not reach the checkout service. Please try again.");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "15px",
        fontWeight: 600,
        padding: "12px 22px",
        borderRadius: "10px",
        border: "none",
        background: "#4c8dff",
        color: "#fff",
        cursor: loading ? "default" : "pointer",
        opacity: loading ? 0.7 : 1,
        fontFamily: "inherit",
      }}
    >
      {loading ? "Redirecting…" : "Get LayoutPick — $5"}
    </button>
  );
}
