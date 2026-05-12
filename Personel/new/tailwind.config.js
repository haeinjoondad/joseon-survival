/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hanji: '#f5e6c8',
        ink: '#1a1008',
        seal: '#c0392b',
        bronze: '#8b6914',
        jade: '#2d6a4f',
      },
      fontFamily: {
        joseon: ['Noto Serif KR', 'serif'],
      },
    },
  },
  plugins: [],
}
