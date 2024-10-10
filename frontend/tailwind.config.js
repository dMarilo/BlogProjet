/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        "logo-green": "#3AC69F",
        "logo-blue": "#2E97F8",
        "logo-yellow": "#FFCB46",
        "logo-red": "#F65A6E"
      },
    },
  },
  plugins: [],
}

