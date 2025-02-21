/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1b496f",
        secondary: "#2972ad",
        highlight: "#5a0b4d",
      },
    },
  },
  plugins: [],
};
