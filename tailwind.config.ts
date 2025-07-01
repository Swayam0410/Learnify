import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // ✅ Required for dark mode toggle
 content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
