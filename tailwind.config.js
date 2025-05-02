// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
    },
    fontFamily: {
      dcart: ['Cookie', 'cursive'],
    },
  },
  plugins: [require('tailwind-scrollbar-hide'),],
}
