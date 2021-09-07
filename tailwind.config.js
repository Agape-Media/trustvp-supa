module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        trustBlue: "#10182F",
        trustDark: "#1A202C",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
