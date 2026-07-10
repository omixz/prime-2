import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#1E1A17",
        smoke: "#2B2521",
        flame: "#D5451B",
        gold: "#F2A93B",
        cream: "#F6EFE4",
      },
      fontFamily: {
        display: ["Oswald", "Impact", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(0, 0, 0, 0.5)",
        glow: "0 20px 50px -20px rgba(213, 69, 27, 0.5)",
      },
    },
  },
  plugins: [],
} satisfies Config;
