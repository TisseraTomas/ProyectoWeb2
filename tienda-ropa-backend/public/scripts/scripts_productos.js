// let page = 1;                 // Página actual
// let cargando = false;        // Para no hacer múltiples fetch a la vez
// const esNewIn = !!document.getElementById("productosContainerNewIn");

// // Función para ordenar un array de productos
// function ordenarProductos(arr, criterio) {
//   const lista = [...arr];
//   switch (criterio) {
//     case "1": // Menor precio
//       lista.sort((a, b) => a.precio - b.precio);
//       break;
//     case "2": // Mayor precio
//       lista.sort((a, b) => b.precio - a.precio);
//       break;
//     case "3": // Nuevos primero
//       lista.sort((a, b) => (b.esNuevo === true) - (a.esNuevo === true));
//       break;
//     default:
//       break;
//   }
//   return lista;
// }

// // Crear la card de producto
// function crearCardProducto(producto) {
//   const card = document.createElement('div');
//   card.className = 'col-md-3 mb-4';
//   card.innerHTML = `
//     <div class="card position-relative h-100"
//          onclick="window.location.href='detalleProductos.html?idGrupo=${encodeURIComponent(producto.producto_padre_id)}'"
//          style="cursor: pointer;">
//       ${producto.esNuevo ?
//         '<span class="badge bg-light text-dark position-absolute top-0 start-0 m-2">NEW IN</span>'
//         : ''}
//       <img src="./img/${producto.imagen}" class="card-img-top" 
//            alt="${producto.nombre}" style="height: 300px; object-fit: cover;">
//       <div class="card-body text-center">
//         <h5 class="card-title">${producto.nombre}</h5>
//         <p class="card-text">$ ${producto.precio.toLocaleString()}</p>
//       </div>
//     </div>
//   `;
//   return card;
// }

// // Agrupar por producto_padre_id
// function agruparPorProductoPadre(arr) {
//   const mapa = new Map();
//   arr.forEach(p => {
//     if (!mapa.has(p.producto_padre_id)) {
//       mapa.set(p.producto_padre_id, p);
//     }
//   });
//   return Array.from(mapa.values());
// }

// // Cargar productos de la página actual
// async function cargarMasProductos() {
//   if (cargando) return;
//   cargando = true;

//   const params = new URLSearchParams(window.location.search);
//   const categoria = params.get("categoria");
//   const talla = params.get("talla");
//   const color = params.get("color");
//   const precioMax = params.get("precioMax");
//   const criterio = document.getElementById("ordenSelect")?.value || "";

//   try {
//     let url = `http://localhost:3000/api/productos/mostrar/catalogo?page=${page}`;
//     if (esNewIn) {
//       url = `http://localhost:3000/api/productos/mostrar/catalogo/nuevos?page=${page}`;
//     }

//     const res = await fetch(url);
//     let productos = await res.json();

//     if (!Array.isArray(productos) || productos.length === 0) {
//       console.log("No hay más productos para cargar.");
//       window.removeEventListener("scroll", scrollHandler);
//       cargando = false;
//       return;
//     }

//     // filtros
//     if (categoria) productos = productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
//     if (talla) productos = productos.filter(p => p.talla === talla);
//     if (color) productos = productos.filter(p => p.color.toLowerCase() === color.toLowerCase());
//     if (precioMax) productos = productos.filter(p => p.precio <= Number(precioMax));

//     // agrupar
//     productos = agruparPorProductoPadre(productos);

//     // ordenar
//     productos = ordenarProductos(productos, criterio);

//     // renderizar
//     const container = esNewIn
//       ? document.getElementById("productosContainerNewIn")
//       : document.getElementById("productosContainer");

//     if (!esNewIn && productos.length === 0 && page === 1) {
//       container.innerHTML = "";
//       const mensajeVacio = document.getElementById("mensajeVacio");
//       if (mensajeVacio) {
//         mensajeVacio.textContent = "No hay productos que coincidan con los filtros seleccionados.";
//       }
//       cargando = false;
//       return;
//     }

//     productos.forEach(p => container.appendChild(crearCardProducto(p)));

//     page++;
//   } catch (err) {
//     console.error("Error al traer productos:", err);
//   } finally {
//     cargando = false;
//   }
// }

// // scroll infinito
// function scrollHandler() {
//   if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
//     cargarMasProductos();
//   }
// }

// // reset y recargar (cuando cambia el orden)
// function resetYRecargar() {
//   page = 1;
//   const container = esNewIn
//     ? document.getElementById("productosContainerNewIn")
//     : document.getElementById("productosContainer");
//   container.innerHTML = "";
//   cargarMasProductos();
// }

// document.addEventListener("DOMContentLoaded", () => {
//   const ordenSelect = document.getElementById("ordenSelect");
//   ordenSelect?.addEventListener("change", () => resetYRecargar());

//   cargarMasProductos(); // primera página
//   window.addEventListener("scroll", scrollHandler);
// });
let page = 1;                 
let cargando = false;        
const esNewIn = !!document.getElementById("productosContainerNewIn");

const params = new URLSearchParams(window.location.search);
const query = params.get("query");

// Función para ordenar un array de productos
function ordenarProductos(arr, criterio) {
  const lista = [...arr];
  switch (criterio) {
    case "1": lista.sort((a, b) => a.precio - b.precio); break;
    case "2": lista.sort((a, b) => b.precio - a.precio); break;
    case "3": lista.sort((a, b) => (b.esNuevo === true) - (a.esNuevo === true)); break;
    default: break;
  }
  return lista;
}

// Crear la card de producto
function crearCardProducto(producto) {
  const card = document.createElement('div');
  card.className = 'col-md-3 mb-4';
  card.innerHTML = `
    <div class="card position-relative h-100"
         onclick="window.location.href='detalleProductos.html?idGrupo=${encodeURIComponent(producto.producto_padre_id)}'"
         style="cursor: pointer;">
      ${producto.esNuevo ?
        '<span class="badge bg-light text-dark position-absolute top-0 start-0 m-2">NEW IN</span>'
        : ''}
      <img src="./img/${producto.imagen}" class="card-img-top" 
           alt="${producto.nombre}" style="height: 300px; object-fit: cover;">
      <div class="card-body text-center">
        <h5 class="card-title">${producto.nombre}</h5>
        <p class="card-text">$ ${producto.precio.toLocaleString()}</p>
      </div>
    </div>
  `;
  return card;
}

// Agrupar por producto_padre_id
function agruparPorProductoPadre(arr) {
  const mapa = new Map();
  arr.forEach(p => {
    if (!mapa.has(p.producto_padre_id)) {
      mapa.set(p.producto_padre_id, p);
    }
  });
  return Array.from(mapa.values());
}

// BUSCAR productos (si viene query en la URL)
async function buscarProductos(termino) {
  const container = document.getElementById("productosContainer");
  const mensajeVacio = document.getElementById("mensajeVacio");
  container.innerHTML = "";
  mensajeVacio.textContent = "";

  try {
    const res = await fetch(`http://localhost:3000/api/productos/buscar?query=${encodeURIComponent(termino)}`);
    if (!res.ok) throw new Error("Error en búsqueda");

    const productos = await res.json();

    if (!Array.isArray(productos) || productos.length === 0) {
      mensajeVacio.textContent = "No se encontraron productos para la búsqueda.";
      return;
    }

    productos.forEach(p => container.appendChild(crearCardProducto(p)));

  } catch (err) {
    console.error("❌ Error buscando productos:", err);
    mensajeVacio.textContent = "Ocurrió un error al buscar productos.";
  }
}

// Cargar productos de catálogo
async function cargarMasProductos() {
  if (cargando) return;
  cargando = true;

  const categoria = params.get("categoria");
  const talla = params.get("talla");
  const color = params.get("color");
  const precioMax = params.get("precioMax");
  const criterio = document.getElementById("ordenSelect")?.value || "";

  try {
    let url = `http://localhost:3000/api/productos/mostrar/catalogo?page=${page}`;
    if (esNewIn) {
      url = `http://localhost:3000/api/productos/mostrar/catalogo/nuevos?page=${page}`;
    }

    const res = await fetch(url);
    let productos = await res.json();

    if (!Array.isArray(productos) || productos.length === 0) {
      console.log("No hay más productos para cargar.");
      window.removeEventListener("scroll", scrollHandler);
      cargando = false;
      return;
    }

    // filtros
    if (categoria) productos = productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
    if (talla) productos = productos.filter(p => p.talla === talla);
    if (color) productos = productos.filter(p => p.color.toLowerCase() === color.toLowerCase());
    if (precioMax) productos = productos.filter(p => p.precio <= Number(precioMax));

    // agrupar
    productos = agruparPorProductoPadre(productos);

    // ordenar
    productos = ordenarProductos(productos, criterio);

    // renderizar
    const container = esNewIn
      ? document.getElementById("productosContainerNewIn")
      : document.getElementById("productosContainer");

    if (!esNewIn && productos.length === 0 && page === 1) {
      container.innerHTML = "";
      const mensajeVacio = document.getElementById("mensajeVacio");
      if (mensajeVacio) {
        mensajeVacio.textContent = "No hay productos que coincidan con los filtros seleccionados.";
      }
      cargando = false;
      return;
    }

    productos.forEach(p => container.appendChild(crearCardProducto(p)));

    page++;
  } catch (err) {
    console.error("Error al traer productos:", err);
  } finally {
    cargando = false;
  }
}

// scroll infinito
function scrollHandler() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
    cargarMasProductos();
  }
}

// reset y recargar (cuando cambia el orden)
function resetYRecargar() {
  page = 1;
  const container = esNewIn
    ? document.getElementById("productosContainerNewIn")
    : document.getElementById("productosContainer");
  container.innerHTML = "";
  cargarMasProductos();
}

// INICIALIZAR
document.addEventListener("DOMContentLoaded", () => {
  const ordenSelect = document.getElementById("ordenSelect");
  ordenSelect?.addEventListener("change", () => resetYRecargar());

  if (query) {
    // si viene una búsqueda en la URL
    buscarProductos(query);
  } else {
    // catálogo normal con scroll infinito
    cargarMasProductos();
    window.addEventListener("scroll", scrollHandler);
  }
});
