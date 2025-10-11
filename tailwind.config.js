module.exports = {
  darkMode: 'class',   // modo oscuro en <html lang="es" class="dark">
  content: [
    "./*.html",        // HTML en la raíz
    "./cbs/**/*.js"    // JS dentro de cbs/
  ],
  theme: {
    screens: {
      sm: '640px',   // sm: aplica desde 640px en adelante
      md: '768px',   // md: aplica desde 768px en adelante
      lg: '1024px',  // lg: aplica desde 1024px en adelante
      xl: '1280px',  // xl: aplica desde 1280px en adelante
      '2xl': '1536px' // 2xl: aplica desde 1536px en adelante
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};

