document.addEventListener('DOMContentLoaded', () => {
  cargarUltimasVentas();
});

async function cargarUltimasVentas() {
  const tbody = document.getElementById('productosBody');

  try {
    const res = await fetch('http://localhost:3000/api/ventas');
    const ventas = await res.json();

    tbody.innerHTML = '';
    ventas.forEach(venta => {
      const fila = document.createElement('tr');
      fila.innerHTML = generarFilaVentaHTML(venta);
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error('Error al cargar las ventas:', err);
  }
}

function generarFilaVentaHTML(venta) {
  return `
    <td>${venta.id}</td>
    <td>${venta.codigo_barras}</td>
    <td>${venta.nombre}</td>
    <td>${venta.cantidad}</td>
    <td>$${venta.precio_unitario}</td>
    <td>${formatearFecha(venta.fecha_venta)}</td>
  `;
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString(); // Puedes personalizar formato si querés
}
