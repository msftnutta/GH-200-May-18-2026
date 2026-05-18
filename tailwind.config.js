/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./views/**/*.ejs', './public/js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    }
  },
  plugins: []
};
