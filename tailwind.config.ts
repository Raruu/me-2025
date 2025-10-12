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
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        "background-tr": "var(--background-tr)",
        primary: "oklch(var(--primary) / <alpha-value>)",
        secondary: "oklch(var(--secondary) / <alpha-value>)",
        tertiary: "oklch(var(--tertiary) / <alpha-value>)",
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
