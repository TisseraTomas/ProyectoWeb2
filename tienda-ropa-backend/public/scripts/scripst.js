
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        console.error('ID de producto no proporcionado');
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/productos/id/${id}`);
        const producto = await res.json();

        // Ejemplo: actualizar título, precio, imagen, etc.
        document.querySelector('h3').textContent = producto.nombre;
        document.querySelector('h4').textContent = `$ ${producto.precio.toLocaleString()}`;
        document.querySelector('.img-fluid').src = `./img/${producto.imagen}`;
        // Podés completar más campos como color, talle, etc.
    } catch (error) {
        console.error('Error al cargar detalles del producto:', error);
    }
});
