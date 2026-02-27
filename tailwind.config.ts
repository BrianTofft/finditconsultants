import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange:   { DEFAULT: "#e28100", dark: "#c47200", light: "#fdf3e3", mid: "#f0a830" },
        charcoal: { DEFAULT: "#2d2c2c" },
        brand:    { green: "#018c00" },
        canvas:   { DEFAULT: "#ffffff", warm: "#f8f6f3" },
      },
      fontFamily: {
        sans:    ["Nunito Sans", "sans-serif"],
        heading: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
