/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0b1f3a',
        navy: '#11294d',
        gold: '#d4af67',
        cream: '#f5f1eb',
      },
      boxShadow: {
        soft: '0 20px 45px rgba(10, 25, 50, 0.15)',
      },
    },
  },
  plugins: [],
};
