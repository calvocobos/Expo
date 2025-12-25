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
 * Lee el JSON de indexación generado por GitHub Actions
 * y muestra el estado de Cosecha
 * Lee metrics/indexing.json
 * y muestra el estado de indexación con links
 */
(async () => {
  const container = document.querySelector("#cosechadores .contenidojson");
  if (!container) return;

  try {
    const res = await fetch("metrics/indexing.json");
    const data = await res.json();

    // ======================
    // Badges
    // ======================
    const badge = (ok) => `
      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
        ${ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}">
        ${ok ? "Indexado" : "En espera"}
      </span>
    `;

    // ======================
    // Links conocidos
    // ======================
    const links = {
      alicia: "https://alicia.concytec.gob.pe",
      renati: "https://renati.sunedu.gob.pe",
      la_referencia: "https://www.lareferencia.info",
              //https://explore.openaire.eu/search/result?pid=10.5281%2Fzenodo.18047949
      openaire: `https://explore.openaire.eu/search/publications?doi=${data.zenodo.doi}`,
      base: `https://www.base-search.net/Search/Results?lookfor=${data.zenodo.doi}&type=all`,
      google_academico:
        `https://scholar.google.com/scholar?q=${encodeURIComponent(data.zenodo.doi)}`
    };

    // ======================
    // Helper para render fila
    // ======================
    const row = (label, ok, url) => `
      <p class="flex items-center gap-2">
        <span class="font-medium">${label}</span>
        ${badge(ok)}
        ${ok && url
          ? `<a href="${url}" target="_blank"
               class="text-blue-600 text-sm hover:underline">
               Ver
             </a>`
          : ""}
      </p>
    `;

    // ======================
    // Render HTML
    // ======================
    container.innerHTML = `
      <p><strong>Identificador:</strong>
        ${data.repositorio_origen.identificador}
      </p>

      <p><strong>OAI ID:</strong>
        ${data.repositorio_origen.oai_id}
      </p>

      <p><strong>Última verificación:</strong>
        ${new Date(data.fecha).toLocaleString("es-PE")}
      </p>

      <hr class="my-3">

      <h4 class="font-semibold mb-2">Repositorio de origen</h4>
      ${row("ALICIA", data.repositorio_origen.indexacion.alicia, links.alicia)}
      ${row("RENATI", data.repositorio_origen.indexacion.renati, links.renati)}
      ${row("La Referencia", data.repositorio_origen.indexacion.la_referencia, links.la_referencia)}

      <hr class="my-3">

      <h4 class="font-semibold mb-2">Zenodo</h4>
      ${row("OpenAIRE", data.zenodo.openaire, links.openaire)}
      ${row("BASE", data.zenodo.base, links.base)}
      ${row("La Referencia (indirecto)", data.zenodo.la_referencia_indirecto, links.la_referencia)}

      <hr class="my-3">

      <h4 class="font-semibold mb-2">Motores de búsqueda</h4>
      ${row("Google Académico", data.motores_busqueda.google_academico, links.google_academico)}
    `;

  } catch (err) {
    container.innerHTML = `
      <p class="text-red-600">
        No se pudo cargar la información de indexación.
      </p>
    `;
  }
})();



/**
 * graficas estadisticas
 * chart js
 */

async function cargarEstadisticas() {
  /* =========================================================
   * 1️⃣ RECOLECCIÓN DE DATOS (JSON)
   * ========================================================= */
  const [incrementos, totales] = await Promise.all([
    fetch("python web/incrementos_diarios.json").then((r) => r.json()),
    fetch("python web/totales.json").then((r) => r.json()),
  ]);

  /* =========================================================
   * 2️⃣ GRÁFICO DONA — TOTALES ACUMULADOS
   * ========================================================= */
  new Chart(document.getElementById("totalesChart"), {
    type: "doughnut",
    data: {
      labels: ["Visitas", "Descargas"],
      datasets: [
        {
          data: [totales.total_visitas, totales.total_descargas],
          backgroundColor: [
            "#38bdf8", // sky-400
            "#f59e0b", // amber-500
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: document.documentElement.classList.contains("dark")
              ? "#fde68a"
              : "#1e293b",
          },
        },
      },
    },
  });

  /* =========================================================
   * 3️⃣ GRÁFICO DE LÍNEAS — INCREMENTOS DIARIOS
   * ========================================================= */
  const registros = incrementos.incrementos_diarios;

  const fechas = Object.keys(registros);
  const visitas = fechas.map((f) => registros[f].visitas_dia);
  const descargas = fechas.map((f) => registros[f].descargas_dia);

  new Chart(document.getElementById("visitasChart"), {
    type: "line",
    data: {
      labels: fechas,
      datasets: [
        {
          label: "Visitas diarias",
          data: visitas,
          borderColor: "#2563eb", // blue-600
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          fill: true,
          tension: 0.35,
        },
        {
          label: "Descargas diarias",
          data: descargas,
          borderColor: "#16a34a", // green-600
          backgroundColor: "rgba(22, 163, 74, 0.1)",
          fill: true,
          tension: 0.35,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: document.documentElement.classList.contains("dark")
              ? "#fbbf24"
              : "#1f2937",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: document.documentElement.classList.contains("dark")
              ? "#cbd5f5"
              : "#475569",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: document.documentElement.classList.contains("dark")
              ? "#cbd5f5"
              : "#475569",
          },
        },
      },
    },
  });
}

/* =========================================================
 * 🚀 EJECUCIÓN
 * ========================================================= */
cargarEstadisticas();
