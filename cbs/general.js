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

/**
 * para cargar el service-worker.js
 */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/Expo/service-worker.js")
      .then((reg) =>
        console.log("✅ Service Worker registrado con éxito:", reg.scope)
      )
      .catch((err) => console.warn("❌ Error al registrar SW:", err));
  });
}

/**
 * leo mi JSON
 * con los datos de si se hizo la cosecha
 * de Alicia Renatil la referencia
 */

(async () => {
  const container = document.querySelector("#cosechadores .contenidojson");
  if (!container) return;

  try {
    const res = await fetch("metrics/indexing.json");
    const data = await res.json();

    const badge = (ok) => `
      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
        ${ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}">
        ${ok ? "Indexado" : "En espera"}
      </span>
    `;

    container.innerHTML = `
      <p><strong>Identificador:</strong> ${data.identificador}</p>
      <p><strong>OAI ID:</strong> ${data.oai_id}</p>
      <p><strong>Última verificación:</strong>
        ${new Date(data.fecha).toLocaleString("es-PE")}
      </p>

      <hr class="my-3">

      <p>ALICIA ${badge(data.indexacion.alicia)}</p>
      <p>RENATI ${badge(data.indexacion.renati)}</p>
      <p>La Referencia ${badge(data.indexacion.la_referencia)}</p>
      <p>Google Académico ${badge(data.indexacion.google_academico)}</p>
    `;
  } catch (err) {
    container.innerHTML = `
      <p class="text-red-600">
        No se pudo cargar la información de indexación.
      </p>`;
  }
})();
