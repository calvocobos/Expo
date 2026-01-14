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

/**
 * informacion de ancho y alto de mi ventana
 */

$(document).ready(function () {
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
 * Reescribir menu lateral derecho
 * usano json como fuente
 */

document.addEventListener("DOMContentLoaded", () => {
  fetch("../Expo/ghaction/sections.json")
    .then((res) => res.json())
    .then((sections) => {
      const menu = document.getElementById("menu-lateral");
      if (!menu) return;

      const ul = menu.querySelector("ul");
      if (!ul) return;

      // Limpiar contenido actual
      ul.innerHTML = "";

      // Crear <li> y <a> para cada sección
      sections.forEach((section) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", `#${section.id}`);
        a.setAttribute("aria-label", `Ir a la sección ${section.titulo}`);
        a.className =
          "block py-2 px-3 rounded hover:bg-amber-300 dark:hover:bg-amber-600";
        a.textContent = section.nombre;
        li.appendChild(a);
        ul.appendChild(li);
      });
    })
    .catch((err) => console.error("Error cargando sections.json:", err));
});

/**
 * accion de mi menu lateral
 */

$(document).ready(function () {
  // botón para mostrar/ocultar menú lateral
  $("#btnmenu").on("click", function () {
    $("#menu-lateral").stop(true, true).slideToggle(300);
  });

  // Delegación de eventos para enlaces generados dinámicamente
  $("#menu-lateral").on("click", "a", function (e) {
    // Ocultar el menú lateral después de hacer clic
    $("#menu-lateral").fadeOut();
  });
});

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
        "OSF · Visitas",
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
            tot.osf?.visitas ?? 0,
          ],
          backgroundColor: [
            "transparent",
            "transparent",
            "#60a5fa", // UAC visitas
            "#fbbf24", // UAC descargas
            "#22c55e", // Zenodo visitas
            "#a855f7", // Zenodo descargas
            "#ef4444", // SUNEDU visitas
            "#22d3ee", // OSF visitas (cyan)
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
  const osfVisitas = fechas.map((f) => registros[f].osf?.visitas_dia ?? 0);

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
        {
          label: "OSF · Visitas",
          data: osfVisitas,
          borderColor: "#22d3ee", // cyan
          backgroundColor: "rgba(34, 211, 238, 0.15)",
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
