/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#1db954',
          secondary: '#f5f5f5',
          background: '#ffffff',
          text: '#121212',
        },
        dark: {
          primary: '#1db954',
          secondary: '#282828',
          background: '#121212',
          text: '#ffffff',
        },
      },
    },
  },
  plugins: [],
} 