import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EB1D63",
        gray: "#464042",
        dark: "#2f2c31",
        gray1: "#3a363c",
      },
      fontFamily: {
        roboto: "var(--font-roboto)",
      },
    },
  },
  plugins: [],
};
export default config;
