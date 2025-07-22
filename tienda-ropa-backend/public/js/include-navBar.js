document.addEventListener("DOMContentLoaded", () => {
  fetch("navBar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar-container").innerHTML = data;

      // ahora que ya se insertó la navbar en el DOM
      inicializarBuscador();
    });
});

function inicializarBuscador() {
  const form = document.getElementById("formBusqueda");
  const input = document.getElementById("inputBusqueda");
  const datalist = document.getElementById("sugerencias");

  if (!form || !input || !datalist) {
    console.error("❌ No se encontraron los elementos del buscador.");
    return;
  }

  console.log("✅ Buscador inicializado.");

  // 👉 Al enviar, vamos a productos.html?query=…
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const termino = input.value.trim();
    if (!termino) return;
    window.location.href = `productos.html?query=${encodeURIComponent(termino)}`;
  });

  // 👉 Autocompletar mientras escribe
  input.addEventListener("input", async () => {
    const termino = input.value.trim();
    if (termino.length < 2) {
      datalist.innerHTML = "";
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/productos/sugerencias?query=${encodeURIComponent(termino)}`);
      if (!res.ok) throw new Error("Error en la petición");
      const sugerencias = await res.json();

      datalist.innerHTML = "";
      sugerencias.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.nombre;
        datalist.appendChild(opt);
      });
    } catch (err) {
      console.error("❌ Error al obtener sugerencias:", err);
    }
  });
}
