import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        "stretch-pull": {
          "0%": { transform: "translateX(-50%) translateY(-4px)" },
          "100%": { transform: "translateX(-50%) translateY(0px)" },
        },
      },
      animation: {
        "stretch-pull": "stretch-pull 0.3s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
