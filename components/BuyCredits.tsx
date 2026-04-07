"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

export default function BuyCredits() {
  const pathname = usePathname();
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);

  const locale = useMemo(() => {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    return firstSegment || "en";
  }, [pathname]);

  const handleCheckout = async (amount: number) => {
    if (loadingAmount !== null) return;

    setLoadingAmount(amount);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount, locale })
      });

      const data = await response.json();

      if (!response.ok || !data?.url) {
        console.error("Stripe checkout error", data);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Stripe checkout request failed", error);
    } finally {
      setLoadingAmount(null);
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: "12px", marginTop: "10px", flexWrap: "wrap" }}>
        <button className="credit-button" onClick={() => handleCheckout(1000)} disabled={loadingAmount !== null}>
          {loadingAmount === 1000 ? "Loading..." : "\u20AC10 - 40 credits"}
        </button>

        <button className="credit-button" onClick={() => handleCheckout(2000)} disabled={loadingAmount !== null}>
          {loadingAmount === 2000 ? "Loading..." : "\u20AC20 - 100 credits"}
        </button>

        <button className="credit-button" onClick={() => handleCheckout(3000)} disabled={loadingAmount !== null}>
          {loadingAmount === 3000 ? "Loading..." : "\u20AC30 - 180 credits"}
        </button>
      </div>

      <style jsx>{`
        .credit-button {
          background-color: #f1c40f;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s, background-color 0.3s, opacity 0.2s;
        }

        .credit-button:hover:not(:disabled) {
          background-color: #e1b30f;
          transform: scale(1.05);
        }

        .credit-button:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }

        .credit-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
      `}</style>
    </>
  );
}
