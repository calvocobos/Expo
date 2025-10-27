/* JS puro */

// Evitar animaciones durante carga inicial
document.documentElement.classList.add("js");

// Registrar carga diferida
window.addEventListener("load", () => {
  console.log("Página completamente cargada");
});

// Esperar a que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnoscuro");
  const html = document.documentElement;

  // Leer modo actual guardado (si existe)
  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado === "dark") {
    html.classList.add("dark");
  } else if (temaGuardado === "light") {
    html.classList.remove("dark");
  }

  // Al hacer clic, alternar modo y guardar preferencia
  btn.addEventListener("click", () => {
    html.classList.toggle("dark");

    // Guardar la preferencia del usuario
    const modoActual = html.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("tema", modoActual);
  });
});

/* JQUERY */

$(document).ready(function () {
  //menu lateral derecho
  $("#btnmenu").on("click", function () {
    $("#menu-lateral").stop(true, true).slideToggle(300);
  });
  //cerar menu al elegir uno
  $("#menu-lateral a").click(function (e) {
    // Ocultar el menú lateral después de hacer clic
    $("#menu-lateral").fadeOut();
  });

  function actualizarTamano() {
    // obtener ancho y alto de la ventana
    let ancho = $(window).width();
    let alto = $(window).height();

    // mostrarlo dentro del div
    $(".ancho").text(`w ${ancho}`);
    $(".alto").text(`h ${alto}`);
  }

  // mostrar tamaño al cargar la página
  $(document).ready(actualizarTamano);

  // actualizar cuando se redimensiona la ventana
  $(window).on("resize", actualizarTamano);
});
