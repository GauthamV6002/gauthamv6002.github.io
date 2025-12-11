/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./archive.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      "inria-serif": ["Inria Serif", "Open Sans", "sans-serif"],
      inter: ["Inter", "Open Sans", "sans-serif"],
      manrope: ["Manrope Variable", "sans-serif"],
      satoshi: ["Satoshi Variable", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
