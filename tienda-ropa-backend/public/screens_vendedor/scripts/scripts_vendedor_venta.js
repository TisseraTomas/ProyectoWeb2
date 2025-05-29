document.addEventListener('DOMContentLoaded', () => {
  const inputBarcode = document.getElementById('searchBarcode');
  const resultado = document.getElementById('resultadoBusqueda');
  const ventaModal = new bootstrap.Modal(document.getElementById('ventaModal'));
  const ventaDetalle = document.getElementById('ventaDetalle');
  const btnConfirmar = document.getElementById('btnConfirmarVenta');

  let productoActual = null;
  let cantidadAVender = 1;

  inputBarcode.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const codigo = inputBarcode.value.trim();
      if (codigo !== '') {
        await buscarProducto(codigo);
      }
    }
  });

  async function buscarProducto(codigo) {
    try {
      const res = await fetch(`http://localhost:3000/api/productos/${codigo}`);
      if (!res.ok) {
        resultado.innerHTML = `<div class="alert alert-warning">Producto no encontrado</div>`;
        return;
      }

      const producto = await res.json();
      productoActual = producto;

      resultado.innerHTML = `
        <div class="card">
          <div class="row g-0">
            <div class="col-md-4 d-flex align-items-center justify-content-center">
              <img src="../img/${producto.imagen}" class="img-fluid rounded-start" alt="${producto.nombre}" style="max-height: 200px; object-fit: contain;" />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">Categoría: ${producto.categoria}</p>
                <p class="card-text">Precio: $${producto.precio}</p>
                <p class="card-text">Stock disponible: ${producto.stock}</p>
                <p class="card-text">Talla: ${producto.talla} - Color: ${producto.color}</p>
                <div class="input-group mb-3">
                  <span class="input-group-text">Cantidad</span>
                  <input type="number" min="1" max="${producto.stock}" value="1" id="cantidadVenta" class="form-control" />
                </div>
                <button class="btn btn-primary" id="btnVender">Vender</button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('btnVender').addEventListener('click', () => {
        cantidadAVender = parseInt(document.getElementById('cantidadVenta').value);
        if (cantidadAVender > producto.stock) {
          alert('No hay suficiente stock.');
          return;
        }

        ventaDetalle.textContent = `Vas a vender ${cantidadAVender} unidad(es) de "${producto.nombre}".`;
        ventaModal.show();
      });

    } catch (error) {
      console.error('Error al buscar producto:', error);
      resultado.innerHTML = `<div class="alert alert-danger">Error al buscar producto</div>`;
    }
  }

  btnConfirmar.addEventListener('click', async () => {
    if (!productoActual) return;

    try {
      const res = await fetch('http://localhost:3000/api/productos/ventas/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo_barras: productoActual.codigo_barras,
          cantidad: cantidadAVender
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Error en la venta');
      } else {
        alert(data.mensaje || 'Venta realizada');
        location.reload();
      }
    } catch (error) {
      console.error('Error al confirmar venta:', error);
      alert('Error en la venta');
    }
  });
});
