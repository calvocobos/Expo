**Version de node y npm**
node -v
npm -v

me sale:
node: 22.17.0
npm:  10.9.2

*Instalar Tailwind CSS v4, usando su CLI actual con su nueva forma de instalación donde CLI ahora es un paquete separado*

**Inicializar un proyecto npm**
npm init -y

**Instala las dependencias necesarias**
npm install -D tailwindcss @tailwindcss/cli

*Crea tu archivo CSS de entrada (tailwind/input.css), y dentro pon:*

@import "tailwindcss";
@config "../tailwind.config.js"

*Crea un archivo tailwind.config.js, y dentro pon:*

module.exports = {
  darkMode: 'class',   // modo oscuro en <html lang="es" class="dark">
  content: [
    "./*.html",        // HTML en la raíz
    "./cbs/**/*.js"    // JS dentro de cbs/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


*Añade un script en package.json para construir tu CSS con la CLI:*

{
  "scripts": {
    "build:css": "npx @tailwindcss/cli -i tailwind/input.css -o tailwind/output.css",
    "watch:css": "npx @tailwindcss/cli -i tailwind/input.css -o tailwind/output.css --watch"
  }
}

**Ejecuta el build:**
npm run build:css

*en el HTML iria para llamarlo*
<link href="./tailwind/output.css" rel="stylesheet">

*plugin de aspecto 16:9*
npm install @tailwindcss/aspect-ratio

*Asegúrate de tener el plugin activado En tu tailwind.config.js:*

module.exports = {
  // ...
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}

----------------------------------------------------------------------