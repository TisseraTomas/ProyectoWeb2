
//ACA
// document.addEventListener("DOMContentLoaded", async () => {
//   if (document.getElementById('productosContainerNewIn')) {
//     cargarProductosNewIn();
//   }

//   const params = new URLSearchParams(window.location.search);
//   const categoria = params.get("categoria");
//   const talla = params.get('talla');
//   const color = params.get('color');
//   const precioMax = params.get('precioMax');

//   if (categoria) {
//     try {
//       const response = await fetch("http://localhost:3000/api/productos/mostrar/catalogo");
//       const productos = await response.json();

//       const filtrados = productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
//       const container = document.getElementById("productosContainer");
//       const mensajeVacio = document.getElementById("mensajeVacio");

//       if (filtrados.length === 0) {
//         container.innerHTML = "";
//         mensajeVacio.textContent = `No hay productos disponible de la categoría "${categoria}" por el momento.`;
//       } else {
//         mensajeVacio.textContent = "";
//         cargarProductos(filtrados, container);
//       }
//     } catch (error) {
//       console.error("Error al cargar productos:", error);
//     }
//   } else {
//     cargarProductosVerTodos();
//   }
// });


// document.addEventListener("DOMContentLoaded", async () => {
//   // Si estamos en la pantalla NEW IN
//   if (document.getElementById('productosContainerNewIn')) {
//     return cargarProductosNewIn();
//   }

//   const params     = new URLSearchParams(window.location.search);
//   const categoria  = params.get("categoria");
//   const talla      = params.get("talla");
//   const color      = params.get("color");
//   const precioMax  = params.get("precioMax");

//   try {
//     // 1) Traigo todo el catálogo
//     const res       = await fetch("http://localhost:3000/api/productos/mostrar/catalogo");
//     const productos = await res.json();

//     // 2) Aplico filtros uno a uno
//     let filtrados = productos;

//     if (categoria) {
//       filtrados = filtrados.filter(p =>
//         p.categoria.toLowerCase() === categoria.toLowerCase()
//       );
//     }

//     if (talla) {
//       filtrados = filtrados.filter(p => p.talla === talla);
//     }

//     if (color) {
//       filtrados = filtrados.filter(p => p.color.toLowerCase() === color.toLowerCase());
//     }

//     if (precioMax) {
//       filtrados = filtrados.filter(p => p.precio <= Number(precioMax));
//     }

//     const container   = document.getElementById("productosContainer");
//     const mensajeVacio = document.getElementById("mensajeVacio");

//     // 3) Muestro mensaje si quedó vacío
//     if (filtrados.length === 0) {
//       container.innerHTML = "";
//       mensajeVacio.textContent = "No hay productos que coincidan con los filtros seleccionados.";
//       return;
//     }

//     mensajeVacio.textContent = "";

//     // 4) Renderizo: agrupo por padre y creo las cards
//     cargarProductos(filtrados, container);

//   } catch (error) {
//     console.error("Error al cargar productos:", error);
//   }
// });

// // 🔁 Función para crear la card de producto
// function crearCardProducto(producto) {
//   const card = document.createElement('div');
//   card.className = 'col-md-3 mb-4';
//   card.innerHTML = `
//     <div class="card position-relative h-100" 
//          onclick="window.location.href='detalleProductos.html?idGrupo=${encodeURIComponent(producto.producto_padre_id)}'" 
//          style="cursor: pointer;">
//       ${producto.esNuevo ? '<span class="badge bg-light text-dark position-absolute top-0 start-0 m-2">NEW IN</span>' : ''}
//       <img src="./img/${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 300px; object-fit: cover;">
//       <div class="card-body text-center">
//         <h5 class="card-title">${producto.nombre}</h5>
//         <p class="card-text">$ ${producto.precio.toLocaleString()}</p>
//       </div>
//     </div>
//   `;
//   return card;
// }

// // 🔁 Función para agrupar productos por producto_padre_id
// function agruparPorProductoPadre(productos) {
//   const mapa = new Map();
//   productos.forEach(p => {
//     if (!mapa.has(p.producto_padre_id)) {
//       mapa.set(p.producto_padre_id, p);
//     }
//   });
//   return Array.from(mapa.values());
// }

// // 🔁 Carga productos filtrados por categoría
// async function cargarProductos(productos, container) {
//   try {
//     container.innerHTML = '';
//     const productosUnicos = agruparPorProductoPadre(productos);
//     productosUnicos.forEach(producto => {
//       container.appendChild(crearCardProducto(producto));
//     });
//   } catch (error) {
//     console.error('Error al cargar productos:', error);
//   }
// }

// // 🔁 Carga todos los productos si no hay categoría
// async function cargarProductosVerTodos() {
//   try {
//     const res = await fetch('http://localhost:3000/api/productos/mostrar/catalogo');
//     const productos = await res.json();

//     const container = document.getElementById('productosContainer');
//     container.innerHTML = '';

//     const productosUnicos = agruparPorProductoPadre(productos);
//     productosUnicos.forEach(producto => {
//       container.appendChild(crearCardProducto(producto));
//     });

//   } catch (error) {
//     console.error('Error al cargar productos:', error);
//   }
// }

// // 🔁 Carga productos nuevos (NEW IN)
// async function cargarProductosNewIn() {
//   try {
//     const res = await fetch('http://localhost:3000/api/productos/mostrar/catalogo/nuevos');
//     const productos = await res.json();

//     const nuevos = productos.filter(p => p.esNuevo);
//     const container = document.getElementById('productosContainerNewIn');
//     container.innerHTML = '';

//     const productosUnicos = agruparPorProductoPadre(nuevos);
//     productosUnicos.forEach(producto => {
//       container.appendChild(crearCardProducto(producto));
//     });

//   } catch (error) {
//     console.error('Error al cargar productos:', error);
//   }
// }


//ACA 2
// let productosGlobal = [];      // Catálogo completo
// let productosFiltrados = [];   // Tras aplicar filtros

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

// document.addEventListener("DOMContentLoaded", async () => {
//   const ordenSelect = document.getElementById("ordenSelect");

//   // Si estamos en la pantalla NEW IN, no aplicamos orden pero sí agrupamos
//   if (document.getElementById('productosContainerNewIn')) {
//     return cargarProductosNewIn();
//   }

//   // 1) Traigo todo el catálogo una sola vez
//   try {
//     const res = await fetch("http://localhost:3000/api/productos/mostrar/catalogo");
//     productosGlobal = await res.json();

//   } catch (err) {
//     console.error("Error al traer catálogo:", err);
//     return;
//   }

//   // 2) Función que aplica filtros, ordena y renderiza
//   function actualizarVista() {
//     const params     = new URLSearchParams(window.location.search);
//     const categoria  = params.get("categoria");
//     const talla      = params.get("talla");
//     const color      = params.get("color");
//     const precioMax  = params.get("precioMax");
//     const criterio   = ordenSelect ? ordenSelect.value : "";

//     // 2.1) Filtrar
//     let arr = productosGlobal;
//     if (categoria) arr = arr.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
//     if (talla)     arr = arr.filter(p => p.talla === talla);
//     if (color)     arr = arr.filter(p => p.color.toLowerCase() === color.toLowerCase());
//     if (precioMax) arr = arr.filter(p => p.precio <= Number(precioMax));

//     // 2.2) Agrupar por padre
//     const mapa = new Map();
//     arr.forEach(p => {
//       if (!mapa.has(p.producto_padre_id)) mapa.set(p.producto_padre_id, p);
//     });
//     productosFiltrados = Array.from(mapa.values());

//     // 2.3) Ordenar
//     const listaFinal = ordenarProductos(productosFiltrados, criterio);

//     // 2.4) Renderizar
//     const container    = document.getElementById("productosContainer");
//     const mensajeVacio = document.getElementById("mensajeVacio");
//     if (listaFinal.length === 0) {
//       container.innerHTML = "";
//       mensajeVacio.textContent = "No hay productos que coincidan con los filtros seleccionados.";
//     } else {
//       mensajeVacio.textContent = "";
//       container.innerHTML = "";
//       listaFinal.forEach(p => container.appendChild(crearCardProducto(p)));
//     }
//   }

//   // 3) Llamo a actualizarVista() al inicio
//   actualizarVista();

//   // 4) Y cada vez que cambie el select de orden
//   if (ordenSelect) {
//     ordenSelect.addEventListener("change", actualizarVista);
//   }
// });

// // 🔁 Función para crear la card de producto
// function crearCardProducto(producto) {
//   const card = document.createElement('div');
//   card.className = 'col-md-3 mb-4';
//   card.innerHTML = `
//     <div class="card position-relative h-100" 
//          onclick="window.location.href='detalleProductos.html?idGrupo=${encodeURIComponent(producto.producto_padre_id)}'" 
//          style="cursor: pointer;">
//       ${producto.esNuevo ? '<span class="badge bg-light text-dark position-absolute top-0 start-0 m-2">NEW IN</span>' : ''}
//       <img src="./img/${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 300px; object-fit: cover;">
//       <div class="card-body text-center">
//         <h5 class="card-title">${producto.nombre}</h5>
//         <p class="card-text">$ ${producto.precio.toLocaleString()}</p>
//       </div>
//     </div>
//   `;
//   return card;
// }

// // 🔁 Carga productos nuevos (NEW IN)
// async function cargarProductosNewIn() {
//   try {
//     const res       = await fetch('http://localhost:3000/api/productos/mostrar/catalogo/nuevos');
//     const productos = await res.json();
//     const nuevos    = productos.filter(p => p.esNuevo);

//     // Agrupar
//     const mapa = new Map();
//     nuevos.forEach(p => {
//       if (!mapa.has(p.producto_padre_id)) mapa.set(p.producto_padre_id, p);
//     });
//     const lista = Array.from(mapa.values());

//     // Renderizar
//     const container = document.getElementById('productosContainerNewIn');
//     container.innerHTML = "";
//     lista.forEach(p => container.appendChild(crearCardProducto(p)));
//   } catch (error) {
//     console.error('Error al cargar NEW IN:', error);
//   }
// }

let productosGlobal = [];      // Catálogo completo

// Función para ordenar un array de productos
function ordenarProductos(arr, criterio) {
  const lista = [...arr];
  switch (criterio) {
    case "1": // Menor precio
      lista.sort((a, b) => a.precio - b.precio);
      break;
    case "2": // Mayor precio
      lista.sort((a, b) => b.precio - a.precio);
      break;
    case "3": // Nuevos primero
      lista.sort((a, b) => (b.esNuevo === true) - (a.esNuevo === true));
      break;
    default:
      break;
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

// La función principal que carga, filtra, agrupa, ordena y renderiza
async function actualizarVista(esNewIn) {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  const talla = params.get("talla");
  const color = params.get("color");
  const precioMax = params.get("precioMax");
  const criterio = document.getElementById("ordenSelect")?.value || "";

  // 1) Obtener datos
  let arr;
  if (esNewIn) {
    // Vista New In: fetch a endpoint nuevos
    const resN = await fetch("http://localhost:3000/api/productos/mostrar/catalogo/nuevos");
    const allN = await resN.json();
    arr = allN.filter(p => p.esNuevo);
  } else {
    // Vista catálogo completo: usamos el array global
    arr = productosGlobal;
  }

  // 2) Aplicar filtros
  if (categoria) arr = arr.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
  if (talla) arr = arr.filter(p => p.talla === talla);
  if (color) arr = arr.filter(p => p.color.toLowerCase() === color.toLowerCase());
  if (precioMax) arr = arr.filter(p => p.precio <= Number(precioMax));

  // 3) Agrupar
  let lista = agruparPorProductoPadre(arr);

  // 4) Ordenar
  lista = ordenarProductos(lista, criterio);

  // 5) Renderizar
  const container = esNewIn
    ? document.getElementById("productosContainerNewIn")
    : document.getElementById("productosContainer");

  // Sólo obtener mensajeVacio si NO es New In
  const mensajeVacio = !esNewIn
    ? document.getElementById("mensajeVacio")
    : null;

  if (!esNewIn && lista.length === 0) {
    container.innerHTML = "";
    mensajeVacio.textContent = "No hay productos que coincidan con los filtros seleccionados.";
  } 

  // En New In, simplemente limpiamos y mostramos siempre
  container.innerHTML = "";
  lista.forEach(p => container.appendChild(crearCardProducto(p)));
}

document.addEventListener("DOMContentLoaded", async () => {
  const ordenSelect = document.getElementById("ordenSelect");
  const esNewIn = !!document.getElementById("productosContainerNewIn");

  if (!esNewIn) {
    // Cargo catálogo completo solo en vista estándar
    try {
      const res = await fetch("http://localhost:3000/api/productos/mostrar/catalogo");
      productosGlobal = await res.json();
    } catch (err) {
      console.error("Error al traer catálogo:", err);
      return;
    }
  }

  // Escucho cambios de orden si existe el select
  ordenSelect?.addEventListener("change", () => actualizarVista(esNewIn));

  // Primera llamada: renderizo según sea New In o catálogo
  actualizarVista(esNewIn);
});
