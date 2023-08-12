/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        blue: "#376eff",
        red: "#fe0f62",
        purple: "#5a35b6",
        green: "#01d1d1",
      },
      fontFamily: {
        poppins: ["poppinsRegular"],
        poppinsBold: ["poppinsBold"],
        poppinsExtra: ["poppinsExtra"],
      },
    },
  },
  daisyui: {
    themes: ["night"],
  },
  plugins: [require("daisyui")],
};
