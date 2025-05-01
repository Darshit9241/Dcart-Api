// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      dcart: ['Cookie', 'cursive'],
    },
  },
  plugins: [require('tailwind-scrollbar-hide'),],
}
