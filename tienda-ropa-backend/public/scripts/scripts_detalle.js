
// document.addEventListener('DOMContentLoaded', async () => {
//     const params = new URLSearchParams(window.location.search);
//     const id = params.get('idGrupo');

//     if (!id) {
//         console.error('ID de producto no proporcionado');
//         return;
//     }

//     try {
//         const res = await fetch(`http://localhost:3000/api/productos/id/${producto_padre_id}`);
//         const producto = await res.json();

//         // Ejemplo: actualizar título, precio, imagen, etc.
//         document.querySelector('h3').textContent = producto.nombre;
//         document.querySelector('h4').textContent = `$ ${producto.precio.toLocaleString()}`;
//         document.querySelector('.img-fluid').src = `./img/${producto.imagen}`;
//         // Podés completar más campos como color, talle, etc.
//     } catch (error) {
//         console.error('Error al cargar detalles del producto:', error);
//     }
// });
const mapaColores = {
    negro: '#000000',
    blanco: '#ffffff',
    rojo: '#ff0000',
    azul: '#0000ff',
    verde: '#00ff00',
    // ...agregá los que necesites
};

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productoPadreId = params.get('idGrupo');

    //Para controlar la cantidad ingresada
    const inputCantidad = document.getElementById('cantidad');
    const btnSumar = document.getElementById('btn-sumar');
    const btnRestar = document.getElementById('btn-restar');


    if (!productoPadreId) {
        console.error('Falta el parámetro idGrupo en la URL');
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/productos/grupo/${productoPadreId}`);
        const data = await res.json();

        if (!data || !data.variantes) {
            console.error('Producto no encontrado');
            return;
        }

        const nombre = data.nombre;
        const variantes = data.variantes;

        // Seteamos datos iniciales
        document.getElementById('nombreProducto').textContent = nombre;

        // Generar talles
        const talleContainer = document.getElementById('contenedorTalles');
        talleContainer.innerHTML = '<strong>Talle:</strong><br>';
        for (let talla in variantes) {
            const btn = document.createElement('span');
            btn.className = 'size-option btn btn-outline-dark btn-sm me-2 mt-2';
            btn.textContent = talla;
            btn.dataset.talla = talla;
            talleContainer.appendChild(btn);
        }

        // Evento al hacer click en un talle
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                cargarColores(btn.dataset.talla);
            });
        });

        // Cargar colores al seleccionar un talle
        function cargarColores(talla) {
            const colorContainer = document.getElementById('contenedorColores');
            colorContainer.innerHTML = '<strong>Color:</strong> <span id="colorSeleccionado" class="ms-2 fw-semibold"></span><br>';
            const colores = variantes[talla];

            for (let color in colores) {
                const span = document.createElement('span');
                span.className = 'color-option d-inline-block border border-dark rounded-circle me-2';
                span.style.width = '25px';
                span.style.height = '25px';
                span.style.backgroundColor = mapaColores[color.toLowerCase()] || color.toLowerCase();
                span.dataset.color = color;
                span.style.cursor = 'pointer';
                colorContainer.appendChild(span);
            }

            // Eventos para color
            document.querySelectorAll('.color-option').forEach(span => {
                span.addEventListener('click', () => {
                    document.querySelectorAll('.color-option').forEach(s => s.classList.remove('border-3'));
                    span.classList.add('border-3');
                    mostrarInfo(talla, span.dataset.color);
                });
            });

            // Autoseleccionar el primero
            const primerColor = Object.keys(colores)[0];
            mostrarInfo(talla, primerColor);
        }

        // Mostrar precio, imagen, stock
        function mostrarInfo(talla, color) {
            const producto = variantes[talla][color];
            console.log(producto);
            document.getElementById('precioProducto').textContent = `$ ${producto.precio.toLocaleString()}`;
            document.getElementById('imagenPrincipal').src = `./img/${producto.imagen}`;
            document.getElementById('stockProducto').textContent = `Stock disponible: ${producto.stock}`;
            document.getElementById('colorSeleccionado').textContent = color;
            // Actualizar validación de cantidad
            actualizarValidacionCantidad(producto.stock);
        }

        // Autoseleccionar el primer talle
        const primerTalla = Object.keys(variantes)[0];
        document.querySelector(`.size-option[data-talla="${primerTalla}"]`).click();

    } catch (error) {
        console.error('Error al cargar el producto:', error);
    }

    //Para controlar la cantidad ingresada
    function actualizarValidacionCantidad(stockMaximo) {
        const mensaje = document.getElementById('mensajeCantidad');

        function mostrarMensaje(msg) {
            mensaje.textContent = msg;
        }

        function limpiarMensaje() {
            mensaje.textContent = '';
        }

        btnSumar.onclick = () => {
            let valor = parseInt(inputCantidad.value) || 1;
            if (valor < stockMaximo) {
                inputCantidad.value = valor + 1;
                limpiarMensaje();
            } else {
                mostrarMensaje(`Máximo disponible: ${stockMaximo}`);
            }
        };

        btnRestar.onclick = () => {
            let valor = parseInt(inputCantidad.value) || 1;
            if (valor > 1) {
                inputCantidad.value = valor - 1;
                limpiarMensaje();
            }
        };

        inputCantidad.oninput = () => {
            let valor = parseInt(inputCantidad.value);
            if (isNaN(valor) || valor < 1) {
                inputCantidad.value = 1;
                mostrarMensaje('La cantidad mínima es 1');
            } else if (valor > stockMaximo) {
                inputCantidad.value = stockMaximo;
                mostrarMensaje(`Máximo disponible: ${stockMaximo}`);
            } else {
                limpiarMensaje();
            }
        };
    }
});


