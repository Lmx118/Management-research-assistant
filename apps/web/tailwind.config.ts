import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14212f",
        slate: "#49637a",
        paper: "#f5f1e8",
        sand: "#e7dcc8",
        brass: "#9f7a43",
        cloud: "#fbfaf7",
        rose: "#c56d5d",
        moss: "#66836e",
      },
      boxShadow: {
        panel: "0 18px 45px rgba(20, 33, 47, 0.08)",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(20,33,47,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,33,47,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;

