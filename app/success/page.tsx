"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SuccessPage() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirming your payment and adding credits...");
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (hasProcessedRef.current) {
      return;
    }

    const sessionId = params.get("session_id");

    if (!sessionId) {
      setStatus("error");
      setMessage("Missing payment session.");
      return;
    }

    hasProcessedRef.current = true;

    void fetch("/api/credits/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sessionId })
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload?.error || "Could not add credits");
        }

        setStatus("success");
        setMessage(
          payload?.alreadyProcessed
            ? "Payment confirmed. Credits were already added to your account."
            : "Payment successful! Credits added."
        );
      })
      .catch((error: unknown) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Could not add credits");
      });
  }, [params]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6 py-16">
      <section className="w-full rounded-[28px] border border-white/50 bg-gradient-to-br from-[#fff6ec]/95 via-[#fff3fb]/95 to-[#edf7ff]/90 p-8 text-center shadow-[0_22px_50px_rgba(111,79,152,0.2)]">
        <h1 className="text-3xl font-black tracking-tight text-[#38234b]">
          {status === "success" ? "Payment Complete" : status === "error" ? "Payment Issue" : "Processing Payment"}
        </h1>
        <p className="mt-4 text-base leading-7 text-[#5c4a6f]">{message}</p>
        <Link
          href="/"
          className="storybook-button storybook-button-primary mt-8 inline-flex px-6 py-3 text-sm"
        >
          Back to stories
        </Link>
      </section>
    </main>
  );
}
