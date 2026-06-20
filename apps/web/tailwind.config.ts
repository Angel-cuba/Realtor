import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        charcoal: "#1d1d1b",
        linen: "#f5f1e8",
        gold: "#f3bd21",
        moss: "#58634b"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(17, 17, 17, 0.10)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
