document.addEventListener('DOMContentLoaded', () => {
  cargarTodosLosProductos(); // Carga inicial

  const inputBarcode = document.getElementById('searchBarcode');
  const clearSearchBtn = document.getElementById('clearSearch');
  const mensaje = document.getElementById('mensajeBusqueda');

  // Buscar con Enter
  inputBarcode.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const codigo = inputBarcode.value.trim();
      if (codigo !== '') {
        await buscarProducto(codigo);
      }
    }
  });

  // Limpiar búsqueda
  clearSearchBtn.addEventListener('click', () => {
    inputBarcode.value = '';
    mensaje.textContent = '';
    cargarTodosLosProductos();
  });
});

async function cargarTodosLosProductos() {
  const tbody = document.getElementById('productosBody');
  const mensaje = document.getElementById('mensajeBusqueda');
  mensaje.textContent = ''; // Limpia mensaje

  try {
    const res = await fetch('http://localhost:3000/api/productos');
    const productos = await res.json();

    tbody.innerHTML = '';
    productos.forEach(producto => {
      const fila = document.createElement('tr');
      fila.innerHTML = generarFilaHTML(producto);
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error('Error al cargar productos:', err);
  }
}

async function buscarProducto(codigo) {
  const tbody = document.getElementById('productosBody');
  const mensaje = document.getElementById('mensajeBusqueda');

  try {
    const res = await fetch(`http://localhost:3000/api/productos/${codigo}`);
    const producto = await res.json();

    tbody.innerHTML = '';

    if (!producto || (Array.isArray(producto) && producto.length === 0)) {
      mensaje.textContent = 'No se encontraron resultados para el código ingresado.';
      return;
    }

    mensaje.textContent = '';

    // Si tu backend devuelve un solo producto como objeto
    const fila = document.createElement('tr');
    fila.innerHTML = generarFilaHTML(producto);
    tbody.appendChild(fila);
  } catch (err) {
    console.error('Error al buscar producto:', err);
    mensaje.textContent = 'Error al buscar producto.';
  }
}

function generarFilaHTML(producto) {
  return `
    <td>${producto.id}</td>
    <td>${producto.nombre}</td>
    <td>${producto.categoria}</td>
    <td>$${producto.precio}</td>
    <td>${producto.stock}</td>
    <td>${producto.codigo_barras}</td>
    <td>${producto.talla}</td>
    <td>${producto.color}</td>
    <td>
      <button class="btn btn-primary btn-sm" onclick="editarProducto(${producto.id})">Editar</button>
      <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
    </td>
  `;
}