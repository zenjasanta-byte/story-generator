"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const credits = params.get("credits");

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ Payment successful!</h1>
      <p>+{credits} credits added 🎉</p>
    </div>
  );
}