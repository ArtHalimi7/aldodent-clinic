/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f2f9fc',
          100: '#e1f1f8',
          200: '#c6e6f3',
          300: '#9dd4eb',
          400: '#68bae0',
          500: '#2596be',
          600: '#1d7aa1',
          700: '#196384',
          800: '#19536d',
          900: '#19465b',
          950: '#0f2d3d',
        },
      },
    },
  },
  plugins: [],
}
