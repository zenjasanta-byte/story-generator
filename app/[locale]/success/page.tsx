"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const locale = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] || "en";
  }, [pathname]);

  const credits = useMemo(() => {
    const raw = Number(searchParams.get("credits") || 0);
    return Number.isFinite(raw) && raw > 0 ? raw : 0;
  }, [searchParams]);

  const backHref = `/${locale}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at top, rgba(255, 236, 214, 0.95), rgba(243, 236, 255, 0.92) 45%, rgba(235, 244, 255, 0.95) 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(255, 255, 255, 0.92)",
          borderRadius: "28px",
          padding: "36px 28px",
          boxShadow: "0 24px 60px rgba(88, 61, 124, 0.18)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            margin: "0 auto 20px",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "34px",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "white",
            boxShadow: "0 14px 30px rgba(34, 197, 94, 0.28)",
          }}
        >
          ?
        </div>

        <p
          style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#8b5f3b",
          }}
        >
          Payment Successful
        </p>

        <h1
          style={{
            margin: "12px 0 8px",
            fontSize: "32px",
            lineHeight: 1.15,
            fontWeight: 900,
            color: "#38234b",
          }}
        >
          Credits added
        </h1>

        <p
          style={{
            margin: "0 auto",
            maxWidth: "320px",
            fontSize: "16px",
            lineHeight: 1.6,
            color: "#5c4a6f",
          }}
        >
          Your payment was completed successfully and your account is ready to use.
        </p>

        <div
          style={{
            marginTop: "24px",
            borderRadius: "20px",
            padding: "18px 20px",
            background: "linear-gradient(135deg, #1f2937, #111827)",
            color: "white",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              opacity: 0.75,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Credits received
          </p>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "34px",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            +{credits} credits
          </p>
        </div>

        <button
          onClick={() => router.push(backHref)}
          style={{
            marginTop: "28px",
            width: "100%",
            border: "none",
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            color: "white",
            background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
            boxShadow: "0 14px 28px rgba(124, 58, 237, 0.28)",
          }}
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}
