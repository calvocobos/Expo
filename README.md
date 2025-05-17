Diapositivas en HTML con Tailwind y J-Query

instalacion:
npm install tailwindcss @tailwindcss/cli

----------------------------------------------------------------------

./src/input.css :
@import "tailwindcss";

----------------------------------------------------------------------

comando construir en tiempo real cada cambio +/

npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch

----------------------------------------------------------------------

comando para construir el output.css +/

npx tailwindcss -i src/input.css -o src/output.css

----------------------------------------------------------------------

uso en mi HTML +/

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio</title>
    <link href="./src/output.css" rel="stylesheet">
</head>

<body>
    <h1 class="text-3xl font-bold underline">
        Hello world!
    </h1>
    <p class="bg-red-600">vamos</p>
</body>

</html>

----------------------------------------------------------------------

Listo es todo, 