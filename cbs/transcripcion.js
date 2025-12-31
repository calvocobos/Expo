$(document).ready(function () {
  function activarTab(tab) {
    // Ocultar todos
    $(".tab-content").addClass("hidden");

    // Mostrar seleccionado
    $("#tab-" + tab).removeClass("hidden");

    // Reset botones
    $(".tab-btn")
      .removeClass(
        "border-b-4 border-amber-500 text-amber-600 dark:text-amber-300"
      )
      .addClass("text-slate-600 dark:text-slate-300");

    // Activar botón actual
    $('.tab-btn[data-tab="' + tab + '"]').addClass(
      "border-b-4 border-amber-500 text-amber-600 dark:text-amber-300"
    );
  }

  // Detectar idioma desde hash
  let hash = window.location.hash.replace("#", "");

  if (hash === "en") {
    activarTab("en");
  } else {
    activarTab("es"); // default
  }

  // Click en botones
  $(".tab-btn").on("click", function () {
    const tab = $(this).data("tab");
    activarTab(tab);
    window.location.hash = tab;
  });
});
