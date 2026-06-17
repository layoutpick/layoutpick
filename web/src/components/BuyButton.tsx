"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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
    <Button size="lg" onClick={handleClick} disabled={loading}>
      {loading ? "Redirecting…" : "Get LayoutPick — $5"}
    </Button>
  );
}
