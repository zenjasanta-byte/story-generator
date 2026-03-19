"use client";

export default function BuyCredits() {
  return (
    <div>
      <button
        onClick={() => {
          console.log("BUY 40 1000");
        }}
      >
        ?10 - 40 credits
      </button>

      <button
        onClick={() => {
          console.log("BUY 100 2000");
        }}
      >
        ?20 - 100 credits
      </button>

      <button
        onClick={() => {
          console.log("BUY 180 3000");
        }}
      >
        ?30 - 180 credits
      </button>
    </div>
  );
}
