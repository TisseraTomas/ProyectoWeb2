document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  console.log(categoria);

  if (categoria) {
    try {
      const response = await fetch("http://localhost:3000/api/productos");
      const productos = await response.json();

      const filtrados = productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
      cargarProductos(filtrados);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }
});


async function cargarProductos(productos) {
  try {
    const container = document.getElementById('productosContainer');
    container.innerHTML = '';

    productos.forEach(producto => {
      const card = document.createElement('div');
      card.className = 'col-md-3 mb-4';
      card.innerHTML = `
      <div class="card position-relative h-100" onclick="window.location.href='detalleProductos.html?id=${producto.id}'" style="cursor: pointer;">
          ${producto.esNuevo ? '<span class="badge bg-light text-dark position-absolute top-0 start-0 m-2">NEW IN</span>' : ''}
          <img src="./img/${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 300px; object-fit: cover;">
          <div class="card-body text-center">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">$ ${producto.precio.toLocaleString()}</p>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

/*
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById('productosContainer')) {
    cargarProductos();
  }

  if (document.getElementById('productosContainerNewIn')) {
    cargarProductosNewIn();
  }
});

async function cargarProductos() {
  try {
    const res = await fetch('http://localhost:3000/api/productos/mostrar/catalogo'); // ajustá el endpoint si es diferente
    const productos = await res.json();

    const container = document.getElementById('productosContainer');
    container.innerHTML = '';

    productos.forEach(producto => {
      const card = document.createElement('div');
      card.className = 'col-md-3 mb-4';
      card.innerHTML = `
      <div class="card position-relative h-100" onclick="window.location.href='detalleProductos.html?id=${producto.id}'" style="cursor: pointer;">
          ${producto.esNuevo ? '<span class="badge bg-light text-dark position-absolute top-0 start-0 m-2">NEW IN</span>' : ''}
          <img src="./img/${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 300px; object-fit: cover;">
          <div class="card-body text-center">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">$ ${producto.precio.toLocaleString()}</p>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}


async function cargarProductosNewIn() {
  try {
    const res = await fetch('http://localhost:3000/api/productos/mostrar/catalogo/nuevos');
    const productos = await res.json();

    // Filtramos solo los productos nuevos
    const nuevos = productos.filter(producto => producto.esNuevo);

    const container = document.getElementById('productosContainerNewIn');
    container.innerHTML = '';

    nuevos.forEach(producto => {
      const card = document.createElement('div');
      card.className = 'col-md-3 mb-4';
      card.innerHTML = `
      <div class="card position-relative h-100" onclick="window.location.href='detalleProductos.html?id=${producto.id}'" style="cursor: pointer;">
          <span class="badge bg-light text-dark position-absolute top-0 start-0 m-2">NEW IN</span>
          <img src="./img/${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 300px; object-fit: cover;">
          <div class="card-body text-center">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">$ ${producto.precio.toLocaleString()}</p>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}*/

