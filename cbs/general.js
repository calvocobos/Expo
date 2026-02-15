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
 * 📊 Dona doble — Totales acumulados
 * Fuente: agrupado/total_acumulado.json
 */

async function cargarDonaTotales() {
  /* =========================================================
   * 1️⃣ CARGA DE JSON
   * ========================================================= */
  const data = await fetch("agrupado/total_acumulado.json")
    .then((r) => r.json());

  const totGlobal = data.total_global;
  const elementos = data.totales_por_elemento;

  /* =========================================================
   * 2️⃣ DONA DOBLE
   * ========================================================= */
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

        "Figshare · Visitas",
        "Figshare · Descargas",
      ],
      datasets: [
        {
          // 🟠 DONA EXTERNA — GLOBAL
          data: [
            totGlobal.visitas,
            totGlobal.descargas,
            0,0,0,0,0,0,0,0
          ],
          backgroundColor: [
            "#38bdf8", // global visitas
            "#f59e0b", // global descargas
            "transparent","transparent","transparent",
            "transparent","transparent","transparent",
            "transparent","transparent"
          ],
          borderWidth: 0,
          radius: "100%",
          cutout: "55%",
        },
        {
          // 🔵 DONA INTERNA — FUENTES
          data: [
            0,0,

            elementos.uac.total_visitas,
            elementos.uac.total_descargas,

            elementos.zenodo.total_visitas,
            elementos.zenodo.total_descargas,

            elementos.sunedu.total_visitas,
            elementos.osf.total_visitas,

            elementos.figshare.total_visitas,
            elementos.figshare.total_descargas,
          ],
          backgroundColor: [
            "transparent","transparent",

            "#60a5fa", // UAC visitas
            "#fbbf24", // UAC descargas

            "#22c55e", // Zenodo visitas
            "#a855f7", // Zenodo descargas

            "#ef4444", // SUNEDU visitas
            "#22d3ee", // OSF visitas

            "#0ea5e9", // Figshare visitas
            "#f97316", // Figshare descargas
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
}

/* =========================================================
 * 🚀 EJECUCIÓN
 * ========================================================= */
cargarDonaTotales();


/**
 * Ahora solo las lineas
 */

/**
 * 📊 Gráfico de líneas — Incrementos por día
 * Fuente: agrupado/incrementos_por_dia.json
 */

async function cargarLineasIncrementos() {
  /* =========================================================
   * 1️⃣ CARGA DE JSON
   * ========================================================= */
  const data = await fetch("agrupado/incrementos_por_dia.json")
    .then((r) => r.json());

  const registros = data.incrementos_por_dia;
  const fechas = Object.keys(registros);

  /* =========================================================
   * 2️⃣ MAPEO DE SERIES
   * ========================================================= */

  const uacVisitas = fechas.map(f => registros[f].uac?.visitas_dia ?? 0);
  const uacDescargas = fechas.map(f => registros[f].uac?.descargas_dia ?? 0);

  const zenVisitas = fechas.map(f => registros[f].zenodo?.visitas_dia ?? 0);
  const zenDescargas = fechas.map(f => registros[f].zenodo?.descargas_dia ?? 0);

  const suneduVisitas = fechas.map(f => registros[f].sunedu?.visitas_dia ?? 0);
  const osfVisitas = fechas.map(f => registros[f].osf?.visitas_dia ?? 0);

  const figshareVisitas = fechas.map(f => registros[f].figshare?.visitas_dia ?? 0);
  const figshareDescargas = fechas.map(f => registros[f].figshare?.descargas_dia ?? 0);

  /* =========================================================
   * 3️⃣ GRÁFICO
   * ========================================================= */

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
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34, 211, 238, 0.15)",
          tension: 0.35,
        },
        {
          label: "Figshare · Visitas",
          data: figshareVisitas,
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14, 165, 233, 0.15)",
          tension: 0.35,
        },
        {
          label: "Figshare · Descargas",
          data: figshareDescargas,
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.15)",
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
cargarLineasIncrementos();

/**
 * ahora numeros de totales
 */

/**
 * 📊 Inserta totales en elementos por ID (versión segura)
 * Fuente: agrupado/total_acumulado.json
 */

async function cargarTotalesEnHTML() {

  try {
    const response = await fetch("agrupado/total_acumulado.json");
    if (!response.ok) return;

    const data = await response.json();

    const totales = data?.totales_por_elemento ?? {};
    const global = data?.total_global ?? {};

    /* =========================================================
     * 🔹 GLOBAL
     * ========================================================= */

    asignarTexto("global-visitas", global.visitas);
    asignarTexto("global-descargas", global.descargas);

    /* =========================================================
     * 🔹 POR ELEMENTO
     * ========================================================= */

    Object.entries(totales).forEach(([key, valores]) => {

      asignarTexto(`${key}-visitas`, valores?.total_visitas);
      asignarTexto(`${key}-descargas`, valores?.total_descargas);

    });

  } catch (error) {
    // Silencioso — no rompe la app
    console.warn("No se pudieron cargar los totales.");
  }
}


/* =========================================================
 * 🔧 Función segura para asignar texto
 * ========================================================= */

function asignarTexto(id, valor) {
  const elemento = document.getElementById(id);

  if (!elemento) return; // 🔒 si no existe, sigue sin error

  elemento.textContent =
    typeof valor === "number"
      ? valor.toLocaleString()
      : "0";
}


/* =========================================================
 * 🚀 EJECUCIÓN
 * ========================================================= */

cargarTotalesEnHTML();

