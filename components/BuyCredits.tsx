"use client";

import { useState } from "react";

export default function BuyCredits() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout(amount: number) {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Stripe error");
      }
    } catch (err) {
      alert("Stripe error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={() => handleCheckout(1000)}>
        €10 - 40 credits
      </button>

      <button onClick={() => handleCheckout(2000)}>
        €20 - 100 credits
      </button>

      <button onClick={() => handleCheckout(3000)}>
        €30 - 180 credits
      </button>
    </div>
  );
}