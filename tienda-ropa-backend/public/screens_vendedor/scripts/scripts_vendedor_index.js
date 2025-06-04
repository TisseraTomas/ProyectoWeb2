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

//Eliminar y editar productos
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('productosBody');

  fetch('http://localhost:3000/api/productos')
    .then(res => res.json())
    .then(productos => {
      tbody.innerHTML = ''; // Limpia el contenido anterior
      productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
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
        tbody.appendChild(fila);
      });
    })
    .catch(err => {
      console.error('Error al cargar productos:', err);
    });
});

function eliminarProducto(id) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        alert(data.mensaje || 'Producto eliminado');
        location.reload();
      })
      .catch(err => console.error('Error al eliminar producto:', err));
  }
}

function editarProducto(id) {
  fetch(`http://127.0.0.1:3000/api/productos/id/${id}`)
    .then(res => res.json())
    .then(producto => {
      // 👇 Agrega esta línea para depurar
      console.log('Producto recibido:', producto);
      // Cargar datos en el formulario
      document.getElementById('editarId').value = producto.id;
      document.getElementById('editarNombre').value = producto.nombre;
      document.getElementById('editarCategoria').value = producto.categoria;
      document.getElementById('editarPrecio').value = producto.precio;
      document.getElementById('editarStock').value = producto.stock;
      document.getElementById('editarCodigoBarras').value = producto.codigo_barras;
      document.getElementById('editarTalla').value = producto.talla;
      document.getElementById('editarColor').value = producto.color;

      // Mostrar modal
      const modal = new bootstrap.Modal(document.getElementById('modalEditarProducto'));
      modal.show();
    })
    .catch(err => console.error('Error al obtener producto:', err));
}

document.getElementById('formEditarProducto').addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('editarId').value;
  const datosActualizados = {
    nombre: document.getElementById('editarNombre').value,
    categoria: document.getElementById('editarCategoria').value,
    precio: parseFloat(document.getElementById('editarPrecio').value),
    stock: parseInt(document.getElementById('editarStock').value),
    codigo_barras: document.getElementById('editarCodigoBarras').value,
    talla: document.getElementById('editarTalla').value,
    color: document.getElementById('editarColor').value,
  };

  fetch(`http://localhost:3000/api/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosActualizados)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje || 'Producto actualizado');
      location.reload();
    })
    .catch(err => console.error('Error al actualizar producto:', err));
});


