import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        'electric-blue': '#00BFFF',
        'sunset-orange': '#FF6347',
        'lush-green': '#32CD32',
      },
      animation: {
        blob: 'blob 7s infinite',
      },
    },
  },
  plugins: [],
};
export default config; 