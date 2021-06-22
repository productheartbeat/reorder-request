module.exports = {
  purge: ['./pages/**/*.jsx', './pages/*.jsx', './components/**/*.jsx', './components/aN*.jsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    }
  },
  plugins: [],
}
