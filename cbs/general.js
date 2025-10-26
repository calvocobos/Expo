$(document).ready(function () {
  /**
   * ancho de pantalla
   */
  function mostrarAncho() {
    var ancho = $(window).width();
    $(".tamano").text(ancho);
  }

  mostrarAncho(); // Mostrar al cargar

  $(window).on("resize", function () {
    mostrarAncho(); // Actualizar al redimensionar
  });

  /**
   * cambios en modo oscuro
   */
  function ModoOscuro(activo) {
    $(".onda").toggleClass("oscuro", activo);
  }

  /**
   * cambia el <html lang="es" class="dark">
   */
  $("#btnoscuro").on("click", function () {
    $("html").toggleClass("dark");
    ModoOscuro($("html").hasClass("dark"));
  });

  /**
   * JQuery menu lateral derecho
   * pequeño
   */
  $("#btnmenu").on("click", function () {
    $("#menu-lateral").stop(true, true).slideToggle(300);
  });
});

/**
 * comportamiento del meno
 */

$(document).ready(function () {
  // Captura todos los enlaces dentro del menú lateral
  $("#menu-lateral a").click(function (e) {
    e.preventDefault(); // Evitar el salto instantáneo

    var destino = $(this).attr("href"); // Tomar el href del enlace
    // Animar el scroll suavemente
    $("html, body").animate(
      {
        scrollTop: $(destino).offset().top - 50, // Ajusta el offset si tienes header fijo
      },
      1000,
      "easeInOutExpo"
    );

    // Ocultar el menú lateral después de hacer clic
    $("#menu-lateral").fadeOut();
  });
});
