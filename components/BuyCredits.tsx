"use client";

export default function BuyCredits() {
  const buyCredits = (amount: number, price: number) => {
    console.log("BUY", amount, price);
  };

  return (
    <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
      <button onClick={() => buyCredits(40, 1000)}>
        {"\u20AC10 - 40 credits"}
      </button>

      <button onClick={() => buyCredits(100, 2000)}>
        {"\u20AC20 - 100 credits"}
      </button>

      <button onClick={() => buyCredits(180, 3000)}>
        {"\u20AC30 - 180 credits"}
      </button>
    </div>
  );
}
