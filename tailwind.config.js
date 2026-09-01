/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E0D0C',      // near-black base
        ivory: '#FBF7EF',    // warm off-white
        parchment: '#F1EADC',
        charcoal: '#211F1C',
        line: '#3A362F',
        gold: {
          DEFAULT: '#C6A15B',
          deep: '#8C6D2F',
          soft: '#E4CD9A',
        },
        rust: '#8B4A3C',
        forest: '#3C4A3E',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.18em',
      },
    },
  },
  plugins: [],
};
