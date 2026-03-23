"use client";

export default function BuyCredits() {
  const buyCredits = async (amount: number, price: number) => {
    console.log("BUY", amount, price);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ credits: amount, price })
    });

    const data = await response.json();

    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
        <button className="credit-button" onClick={() => buyCredits(40, 1000)}>
          {"\u20AC10 - 40 credits"}
        </button>

        <button className="credit-button" onClick={() => buyCredits(100, 2000)}>
          {"\u20AC20 - 100 credits"}
        </button>

        <button className="credit-button" onClick={() => buyCredits(180, 3000)}>
          {"\u20AC30 - 180 credits"}
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
          transition: transform 0.2s, background-color 0.3s;
        }

        .credit-button:hover {
          background-color: #e1b30f;
          transform: scale(1.05);
        }

        .credit-button:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
}
