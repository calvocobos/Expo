module.exports = {
  darkMode: "class", // modo oscuro en <html lang="es" class="dark">
  content: [
    "./*.html", // HTML en la raíz
    "./cbs/**/*.js", // JS dentro de cbs/
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Ubuntu", "sans-serif"], // reemplaza la fuente sans predeterminada
      },
      colors: {
        testcolor: "#123456",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
