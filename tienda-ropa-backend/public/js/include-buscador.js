document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("inputBusqueda");
    const datalist = document.getElementById("sugerencias");
    const form = document.getElementById("formBusqueda");
    const contenedorProductos = document.getElementById("productosContainer");
    const mensajeVacio = document.getElementById("mensajeVacio");

    // Autocompletado mientras escribís
    input.addEventListener("input", async () => {
        const termino = input.value.trim();
        if (termino.length < 2) return;

        try {
            const res = await fetch(`/api/productos/sugerencias?query=${encodeURIComponent(termino)}`);
            const sugerencias = await res.json();
            datalist.innerHTML = "";
            sugerencias.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.nombre;
                datalist.appendChild(opt);
            });
        } catch (err) {
            console.error("Error buscando sugerencias", err);
        }
    });

    // Buscar productos cuando se envía el formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const termino = input.value.trim();
        if (!termino) return;

        try {
            const res = await fetch(`/api/productos/buscar?query=${encodeURIComponent(termino)}`);
            const productos = await res.json();

            contenedorProductos.innerHTML = "";
            mensajeVacio.innerText = "";

            if (productos.length === 0) {
                mensajeVacio.innerText = "No se encontraron prendas que coincidan con la búsqueda.";
                return;
            }

            productos.forEach(prod => {
                const card = document.createElement("div");
                card.className = "col-md-4 mb-3";
                card.innerHTML = `
                    <div class="card">
                        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${prod.nombre}</h5>
                            <p class="card-text">Precio: $${prod.precio}</p>
                        </div>
                    </div>
                `;
                contenedorProductos.appendChild(card);
            });
        } catch (err) {
            console.error("Error buscando productos", err);
        }
    });
});
