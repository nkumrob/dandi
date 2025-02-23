/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translate(-50%, -1rem)", opacity: 0 },
          "100%": { transform: "translate(-50%, 0)", opacity: 1 },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.2s ease-out",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
