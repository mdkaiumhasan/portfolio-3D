/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './admin.html',
    './src/admin/**/*.{js,ts,jsx,tsx}',
    './public/classic.html',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#10b981',
          600: '#059669',
        },
      },
    },
  },
  plugins: [],
};

