import type { Config } from "tailwindcss";

const withAlpha = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens — edit the RGB triplets in app/globals.css
        bg: withAlpha("--bg"),
        surface: withAlpha("--surface"),
        fg: withAlpha("--fg"),
        muted: withAlpha("--muted"),
        line: withAlpha("--line"),
        // Brand accents
        cyan: { DEFAULT: withAlpha("--cyan") },
        violet: { DEFAULT: withAlpha("--violet") },
        gold: { DEFAULT: withAlpha("--gold") },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(120deg, rgb(var(--cyan)) 0%, rgb(var(--violet)) 55%, rgb(var(--gold)) 100%)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        spin3d: {
          "0%": { transform: "rotateX(-14deg) rotateY(0deg)" },
          "100%": { transform: "rotateX(-14deg) rotateY(360deg)" },
        },
        meshShift: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(6%,-4%,0) scale(1.15)" },
          "100%": { transform: "translate3d(-4%,5%,0) scale(1)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 2.2s linear infinite",
        pulseRing: "pulseRing 2s cubic-bezier(0.2,0.6,0.3,1) infinite",
        float: "float 6s ease-in-out infinite",
        meshShift: "meshShift 18s ease-in-out infinite alternate",
        spin3d: "spin3d 4.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
