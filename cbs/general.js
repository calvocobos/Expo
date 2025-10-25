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
  $("#menucontenido").fadeOut("slow");
  $("#btnmenu").on("click", function () {
    $("#menucontenido").stop(true, true).slideToggle(300);
  });
});

$(document).ready(function () {
  $("button").click(function () {
    // Obtener el destino desde el atributo data-target
    var destino = $(this).data("target");
    console.log(destino);

    // Animar el scroll
    $("html, body").animate(
      {
        scrollTop: $(destino).offset().top - 50,
      },
      1000,
      "easeInOutExpo"
    );
  });
});
