/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fefefe',
          100: '#fdfcf9',
          200: '#faf8f0',
          300: '#f5f1e6',
          400: '#ede7d4',
          500: '#e0d8c0',
          600: '#c8bda0',
          700: '#a89f7d',
          800: '#8a8164',
          900: '#6b6550',
          950: '#3d3a2e',
        },
        'warm-brown': {
          50: '#fdfcf9',
          100: '#f9f6f0',
          200: '#f2ede0',
          300: '#e8dfc8',
          400: '#d9cba8',
          500: '#c7b58a',
          600: '#b39d6d',
          700: '#9a8558',
          800: '#7f6d4a',
          900: '#6a5a3f',
          950: '#3a3123',
        },
        'accent-gold': {
          50: '#fefdf8',
          100: '#fef9e6',
          200: '#fdf2cc',
          300: '#fbe7a3',
          400: '#f7d56a',
          500: '#f3c23a',
          600: '#e4a91a',
          700: '#bd8414',
          800: '#966816',
          900: '#7a5518',
          950: '#452e0c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 