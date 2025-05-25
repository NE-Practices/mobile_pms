/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A97B9',
          dark: '#0F3460',
          light: '#E2F3F5',
        },
        secondary: {
          DEFAULT: '#FF9800',
          dark: '#F57C00',
          light: '#FFF3E0',
        },
      },
      fontFamily: {
        sans: ['Poppins-Regular', 'sans-serif'],
        medium: ['Poppins-Medium', 'sans-serif'],
        semibold: ['Poppins-SemiBold', 'sans-serif'],
        bold: ['Poppins-Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};