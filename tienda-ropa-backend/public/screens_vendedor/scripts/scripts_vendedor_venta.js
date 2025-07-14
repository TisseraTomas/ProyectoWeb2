// 

document.addEventListener('DOMContentLoaded', () => {
  const inputBarcode = document.getElementById('searchBarcode');
  const resultado = document.getElementById('resultadoBusqueda');
  const carritoBody = document.getElementById('carritoBody');
  const btnConfirmarVenta = document.getElementById('btnConfirmarVenta');

  const carrito = []; // Array para los productos del carrito

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
                <button class="btn btn-primary" id="btnAgregarCarrito">Agregar al carrito</button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('btnAgregarCarrito').addEventListener('click', () => {
        const cantidad = parseInt(document.getElementById('cantidadVenta').value);

        if (cantidad > producto.stock) {
          alert('No hay suficiente stock.');
          return;
        }

        agregarAlCarrito(producto, cantidad);
      });

    } catch (error) {
      console.error('Error al buscar producto:', error);
      resultado.innerHTML = `<div class="alert alert-danger">Error al buscar producto</div>`;
    }
  }

  function agregarAlCarrito(producto, cantidad) {
    const idx = carrito.findIndex(p => p.codigo_barras === producto.codigo_barras);

    if (idx !== -1) {
      if (carrito[idx].cantidad + cantidad > producto.stock) {
        alert('No hay suficiente stock.');
        return;
      }
      carrito[idx].cantidad += cantidad;
    } else {
      carrito.push({
        ...producto,
        cantidad
      });
    }

    renderCarrito();
  }

  function renderCarrito() {
    carritoBody.innerHTML = '';

    let total = 0;

    carrito.forEach((p, index) => {
      const subtotal = p.precio * p.cantidad;
      total += subtotal;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.codigo_barras}</td>
        <td>${p.cantidad}</td>
        <td>$${p.precio}</td>
        <td>$${subtotal}</td>
        <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">Quitar</button></td>
      `;
      carritoBody.appendChild(tr);
    });

    if (carrito.length > 0) {
      btnConfirmarVenta.disabled = false;
    } else {
      btnConfirmarVenta.disabled = true;
    }
  }

  window.eliminarDelCarrito = (index) => {
    carrito.splice(index, 1);
    renderCarrito();
  }

  btnConfirmarVenta.addEventListener('click', async () => {
    if (carrito.length === 0) return;

    try {
      const res = await fetch('http://localhost:3000/api/productos/ventas/vender-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carrito.map(p => ({
          codigo_barras: p.codigo_barras,
          cantidad: p.cantidad
        })))
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

