"use client";

export default function BuyCredits() {
  const buyCredits = (amount: number, price: number) => {
    console.log("BUY", amount, price);
  };

  return (
    <div>
      <button onClick={() => buyCredits(40, 1000)}>
        €10 - 40 credits
      </button>

      <button onClick={() => buyCredits(100, 2000)}>
        €20 - 100 credits
      </button>

      <button onClick={() => buyCredits(180, 3000)}>
        €30 - 180 credits
      </button>
    </div>
  );
}
