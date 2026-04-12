import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: [
          "var(--font-syne)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "var(--font-dm-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      animation: {
        blob: "blob 7s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
