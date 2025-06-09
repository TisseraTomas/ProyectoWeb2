// ------- Generar preview de código de barras -------
function renderBarcode(code) {
    if (!code) {
        document.getElementById("barcodePreview").innerHTML = "";
        return;
    }
    JsBarcode("#barcodePreview", code, { height: 40, width: 2 });
}

//Maneja la carga de un producto
document.getElementById('formAlta').addEventListener('submit', async function (e) {
  e.preventDefault(); // Evita recarga

  const form = e.target;
  const formData = new FormData(form); // Captura los datos, incluyendo el archivo

  try {
    const res = await fetch('http://localhost:3000/api/productos/agregar', {
      method: 'POST',
      body: formData
    });
    console.log('Respuesta:', res); // 👈 Esto te muestra si vino con status 200 o error
    const data = await res.json();

    const msg = document.getElementById('altaMsg');
    if (res.ok) {
      msg.className = 'alert alert-success mt-3';
      msg.textContent = data.mensaje;
      msg.classList.remove('d-none');
      form.reset(); // Limpia el formulario
    } else {
      msg.className = 'alert alert-danger mt-3';
      msg.textContent = data.error || 'Ocurrió un error';
      msg.classList.remove('d-none');
    }
  } catch (error) {
    console.error('Error de red', error);
    const msg = document.getElementById('altaMsg');
    msg.className = 'alert alert-danger mt-3';
    msg.textContent = 'Error de conexión con el servidor';
    msg.classList.remove('d-none');
  }
});

