import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff8ef",
          100: "#ffedd4",
          200: "#ffd6a7",
          300: "#ffbd79",
          400: "#ffa458",
          500: "#ff8f3f",
          600: "#e67127",
          700: "#b4521f",
          800: "#833a1b",
          900: "#5b2818"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(255, 143, 63, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
