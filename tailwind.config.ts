import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        border: "#1A1A1A",
        "bg-main": "#E8D5B7",
        "bg-card": "#F5EDD7",
        yellow: "#F0C93A",
        salmon: "#E8836A",
        mint: "#A8C5A0",
        lavender: "#B8A9D4",
      },
    },
  },
  plugins: [],
};
export default config;
