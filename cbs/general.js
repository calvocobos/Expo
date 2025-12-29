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
      la_referencia: "https://www.lareferencia.info",

      // OpenAIRE (link público válido por PID)
      openaire: `https://explore.openaire.eu/search/result?pid=${encodeURIComponent(
        data.zenodo.doi
      )}`,

      // BASE (no existe permalink confiable)
      base: "https://www.base-search.net",

      google_academico: `https://scholar.google.com/scholar?q=${encodeURIComponent(
        data.zenodo.doi
      )}`,
    };

    // ======================
    // Helper para render fila
    // ======================
    const row = (label, ok, url) => `
      <p class="flex items-center gap-2">
        <span class="font-medium">${label}</span>
        ${badge(ok)}
        ${
          ok && url
            ? `<a href="${url}" target="_blank"
               class="text-blue-600 text-sm hover:underline">
               Ver
             </a>`
            : ""
        }
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
      ${row(
        "La Referencia",
        data.repositorio_origen.indexacion.la_referencia,
        links.la_referencia
      )}

      <hr class="my-3">

      <h4 class="font-semibold mb-2">Zenodo</h4>
      ${row("OpenAIRE", data.zenodo.openaire, links.openaire)}
      ${row("BASE", data.zenodo.base, links.base)}
      ${row(
        "La Referencia (indirecto)",
        data.zenodo.la_referencia_indirecto,
        links.la_referencia
      )}

      <hr class="my-3">

      <h4 class="font-semibold mb-2">Motores de búsqueda</h4>
      ${row(
        "Google Académico",
        data.motores_busqueda.google_academico,
        links.google_academico
      )}
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
 * 📊 Gráficas estadísticas
 * Chart.js
 * Dona doble + Líneas (UAC / Zenodo / SUNEDU)
 */

async function cargarEstadisticas() {
  /* =========================================================
   * 1️⃣ CARGA DE JSON
   * ========================================================= */
  const [incrementos, totales] = await Promise.all([
    fetch("python web/incrementos_por_dia.json").then((r) => r.json()),
    fetch("python web/totales_acumulados.json").then((r) => r.json()),
  ]);

  /* =========================================================
   * 2️⃣ DONA DOBLE — TOTALES
   * ========================================================= */
  const tot = totales.totales;

  new Chart(document.getElementById("totalesChart"), {
    type: "doughnut",
    data: {
      labels: [
        "Global · Visitas",
        "Global · Descargas",
        "UAC · Visitas",
        "UAC · Descargas",
        "Zenodo · Visitas",
        "Zenodo · Descargas",
        "SUNEDU · Visitas",
      ],
      datasets: [
        {
          // 🟠 DONA EXTERNA — GLOBAL
          data: [tot.global.visitas, tot.global.descargas, 0, 0, 0, 0, 0],
          backgroundColor: [
            "#38bdf8",
            "#f59e0b",
            "transparent",
            "transparent",
            "transparent",
            "transparent",
            "transparent",
          ],
          borderWidth: 0,
          radius: "100%",
          cutout: "55%", // ⬅️ deja espacio para la interna
        },
        {
          // 🔵 DONA INTERNA — FUENTES
          data: [
            0,
            0,
            tot.uac.visitas,
            tot.uac.descargas,
            tot.zenodo.visitas,
            tot.zenodo.descargas,
            tot.sunedu.visitas,
          ],
          backgroundColor: [
            "transparent",
            "transparent",
            "#60a5fa",   // UAC visitas
            "#fbbf24",   // UAC descargas
            "#22c55e",   // Zenodo visitas
            "#a855f7",   // Zenodo descargas
            "#ef4444",   // SUNEDU visitas
          ],
          borderWidth: 0,
          radius: "78%",
          cutout: "62%",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw.toLocaleString()}`,
          },
        },
        datalabels: {
          color: "#111827",
          font: { weight: "bold", size: 12 },
          formatter: (v) => (v > 0 ? v : ""),
        },
      },
    },
    plugins: [ChartDataLabels],
  });

  /* =========================================================
   * 3️⃣ GRÁFICO DE LÍNEAS — 5 SERIES
   * ========================================================= */
  const registros = incrementos.incrementos_por_dia;
  const fechas = Object.keys(registros);

  const uacVisitas = fechas.map((f) => registros[f].uac.visitas_dia);
  const uacDescargas = fechas.map((f) => registros[f].uac.descargas_dia);
  const zenVisitas = fechas.map((f) => registros[f].zenodo.visitas_dia);
  const zenDescargas = fechas.map((f) => registros[f].zenodo.descargas_dia);
  const suneduVisitas = fechas.map(
    (f) => registros[f].sunedu?.visitas_dia ?? 0
  );

  new Chart(document.getElementById("pordiaChart"), {
    type: "line",
    data: {
      labels: fechas,
      datasets: [
        {
          label: "UAC · Visitas",
          data: uacVisitas,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.15)",
          tension: 0.35,
        },
        {
          label: "UAC · Descargas",
          data: uacDescargas,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.15)",
          tension: 0.35,
        },
        {
          label: "Zenodo · Visitas",
          data: zenVisitas,
          borderColor: "#16a34a",
          backgroundColor: "rgba(22, 163, 74, 0.15)",
          tension: 0.35,
        },
        {
          label: "Zenodo · Descargas",
          data: zenDescargas,
          borderColor: "#a855f7",
          backgroundColor: "rgba(168, 85, 247, 0.15)",
          tension: 0.35,
        },
        {
          label: "SUNEDU · Visitas",
          data: suneduVisitas,
          borderColor: "#dc2626",
          backgroundColor: "rgba(220, 38, 38, 0.15)",
          tension: 0.35,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
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

