/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        josefin: ['Josefin Sans', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadein 500ms cubic-bezier(0.42, 0, 0.22, 1.38) forwards',
      },
      keyframes: {
        fadein: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
    },
  },
  plugins: [],
};
