"use client";

export default function BuyCredits() {
  const handleCheckout = async (amount: number) => {
    try {
      console.log("CALLING API", amount);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      console.log("RESPONSE", data);

      if (data.url) {
        // 🔥 РЕДИРЕКТ НА STRIPE
        window.location.href = data.url;
      } else {
        alert("Stripe error: no URL");
      }
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);
      alert("Ошибка при оплате");
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
        <button className="credit-button" onClick={() => handleCheckout(1000)}>
          €10 - 40 credits
        </button>

        <button className="credit-button" onClick={() => handleCheckout(2000)}>
          €20 - 100 credits
        </button>

        <button className="credit-button" onClick={() => handleCheckout(3000)}>
          €30 - 180 credits
        </button>
      </div>

      <style jsx>{`
        .credit-button {
          background: linear-gradient(135deg, #ff9a9e, #fad0c4);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .credit-button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .credit-button:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
}