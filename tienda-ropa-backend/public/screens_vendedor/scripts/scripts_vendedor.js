// ------- Generar preview de código de barras -------
function renderBarcode(code) {
    if (!code) {
        document.getElementById("barcodePreview").innerHTML = "";
        return;
    }
    JsBarcode("#barcodePreview", code, { height: 40, width: 2 });
}

/*// ------- Alta de producto -------
document.getElementById("formAlta").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const res = await fetch("/api/productos/agregar", {
        method: "POST",
        body: data,
    });
    const msg = document.getElementById("altaMsg");
    if (res.ok) {
        msg.className = "alert alert-success mt-3";
        msg.textContent = "Producto guardado correctamente.";
        form.reset();
        document.getElementById("barcodePreview").innerHTML = "";
    } else {
        const { error } = await res.json();
        msg.className = "alert alert-danger mt-3";
        msg.textContent = error || "Error al guardar.";
    }
    msg.classList.remove("d-none");
});*/

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

