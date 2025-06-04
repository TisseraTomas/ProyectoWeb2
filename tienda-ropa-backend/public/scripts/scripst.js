// ------- Generar preview de código de barras -------
function renderBarcode(code) {
    if (!code) {
        document.getElementById("barcodePreview").innerHTML = "";
        return;
    }
    JsBarcode("#barcodePreview", code, { height: 40, width: 2 });
}

// ------- Alta de producto -------
document.getElementById("formAlta").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const res = await fetch("/api/productos/agregar", {
        method: "POST",
        body: data,
    });
    const msg = document.getElementById("altaMsg");
    if (res.ok) {
        msg.className = "alert alert-success mt-3";
        msg.textContent = "Producto guardado correctamente.";
        form.reset();
        document.getElementById("barcodePreview").innerHTML = "";
    } else {
        const { error } = await res.json();
        msg.className = "alert alert-danger mt-3";
        msg.textContent = error || "Error al guardar.";
    }
    msg.classList.remove("d-none");
});

// ------- Búsqueda por código de barras -------
document
    .getElementById("searchBarcode")
    .addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarProducto(e.target.value.trim());
        }
    });

async function buscarProducto(code) {
    if (!code) return;

    const res = await fetch(`/api/productos/${code}`);
    const cont = document.getElementById("resultadoBusqueda");
    if (!res.ok) {
        cont.innerHTML =
            '<div class="alert alert-warning">Producto no encontrado</div>';
        return;
    }
    const p = await res.json();
    cont.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${p.nombre}</h5>
            <p class="card-text">
              <strong>Categoría:</strong> ${p.categoria}<br/>
              <strong>Talla:</strong> ${p.talla}<br/>
              <strong>Color:</strong> ${p.color}<br/>
              <strong>Modelo:</strong> ${p.modelo || "-"}<br/>
              <strong>Precio:</strong> $${p.precio}<br/>
              <strong>Stock:</strong> ${p.stock}
            </p>
            <button class="btn btn-primary" onclick="abrirVenta('${p.codigo_barras}', '${p.nombre}', ${p.precio})">
              Vender
            </button>
          </div>
        </div>
      `;
}

// ------- Modal de venta -------
let codigoVentaActual = null;
function abrirVenta(code, nombre, precio) {
    codigoVentaActual = code;
    document.getElementById(
        "ventaDetalle"
    ).textContent = `${nombre} – $${precio}`;
    new bootstrap.Modal("#ventaModal").show();
}

document
    .getElementById("btnConfirmarVenta")
    .addEventListener("click", async () => {
        if (!codigoVentaActual) return;
        const res = await fetch("/api/ventas/vender", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigo_barras: codigoVentaActual }),
        });
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("ventaModal")
        );
        modal.hide();
        if (res.ok) {
            alert("Venta realizada con éxito.");
            buscarProducto(codigoVentaActual); // refrescar stock
            codigoVentaActual = null;
        } else {
            const { error } = await res.json();
            alert(error || "Error al vender.");
        }
    });