"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const credits = params.get("credits");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          textAlign: "center",
          minWidth: "300px",
        }}
      >
        <h2>✅ Payment successful!</h2>

        <div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            margin: "20px 0",
          }}
        >
          +{credits} credits 🎉
        </div>

        <button
          onClick={() => router.push("/en")}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            background: "#4CAF50",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          🔙 Back to Home
        </button>
      </div>
    </div>
  );
}