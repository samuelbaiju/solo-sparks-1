const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      primary: {
        100: '#E6F0FF',
        200: '#B8D8FF',
        300: '#8ABFFF',
        400: '#5C97FF',
        500: '#2E6FFF',
        600: '#0047D1',
        700: '#00359E',
        800: '#00236B',
        900: '#001238',
      },
      secondary: colors.amber,
      neutral: colors.stone,
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 