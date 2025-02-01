import type { Config } from "tailwindcss";

export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "bounce-small": "bounce-small 1s infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        "bounce-small": {
          "0%, 100%": { transform: "none" },
          "50%": { transform: "translateY(-5%)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
      },
    },
    fontFamily: {
      sans: ["Nunito"],
    },
  },
  plugins: [],
} satisfies Config;
