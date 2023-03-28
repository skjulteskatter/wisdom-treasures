/* eslint-disable no-undef */
module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Quando" ,"serif"],
    },
    extend: {
      colors: {
        primary: "#3D6E7C",
        secondary: "#BB9758",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
};
