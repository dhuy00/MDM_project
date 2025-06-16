/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-orange": '#EE4D2D',
      },
      fontFamily: {
        'roboto': "Roboto",
      }
    },
  },
  plugins: [],
}