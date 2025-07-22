function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function inicializarCarrito() {
    const contenedor = document.getElementById("contenedorCarrito");

    function mostrarCarrito() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        contenedor.innerHTML = "";

        if (carrito.length === 0) {
            contenedor.innerHTML = `<p class="text-center mt-3">El carrito está vacío</p>`;
            return;
        }

        carrito.forEach((item, index) => {
            const productoHTML = `
            <div class="card mb-3 position-relative">
                <button class="btn-close position-absolute top-0 end-0 m-2 eliminar-producto" data-index="${index}" aria-label="Eliminar"></button>
                <div class="card-body">
                    <h5 class="card-title">${item.nombre}</h5>
                    <p class="card-text">Color: ${item.color}</p>
                    <p class="card-text">Talle: ${item.talle}</p>
                    <p class="card-text">Cantidad: ${item.cantidad}</p>
                    <p class="card-text">Precio: $${item.precio}</p>
                </div>
            </div>`;
            contenedor.innerHTML += productoHTML;
        });

        document.querySelectorAll('.eliminar-producto').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                eliminarProductoDelCarrito(index);
            });
        });
    }

    function eliminarProductoDelCarrito(index) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }

    function eliminarProductoDelCarrito(index) {
        if (confirm("¿Seguro que quieres eliminar este producto del carrito?")) {
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
        }
    }

    const offcanvasEl = document.getElementById("offcanvasCarrito");
    if (offcanvasEl) {
        offcanvasEl.addEventListener('show.bs.offcanvas', mostrarCarrito);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const carritoContainer = document.getElementById("carrito-container");

    if (carritoContainer) {
        fetch("carrito.html")
            .then(response => response.text())
            .then(html => {
                carritoContainer.innerHTML = html;
                inicializarCarrito(); // Lógica se activa luego de insertar el HTML
            });
    }
});


