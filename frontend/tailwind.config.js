/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        screens: {
          'xs': '400px',
          'sm': '600px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1350px',
          '3xl': '1800px', 
        },
      },
    },
    plugins: [],
  }
  