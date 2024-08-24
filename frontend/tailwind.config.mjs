/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // color variables
      colors: {
        primary: "#2B85FF",
        secondary: "#EF863E",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.overflow-anywhere': {
          'overflow-wrap': 'anywhere',
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}

