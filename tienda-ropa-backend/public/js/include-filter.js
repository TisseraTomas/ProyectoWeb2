document.addEventListener("DOMContentLoaded", () => {
  fetch("filter.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("filter-container").innerHTML = data;

      // Controlar precio barra
      const precioRange = document.getElementById('precioRange');
      const precioLabel = document.getElementById('precioLabel');

      function actualizarPrecioLabel() {
        const min = Number(precioRange.min).toLocaleString();
        const val = Number(precioRange.value).toLocaleString();
        const max = Number(precioRange.max).toLocaleString();
        precioLabel.textContent = `AR$${min} — AR$${val}`;
      }
      // lo llamamos al iniciar y al mover el slider
      actualizarPrecioLabel();
      precioRange.addEventListener('input', actualizarPrecioLabel);

      // Lógica para poder desmarcar radios
      document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('mousedown', function () {
          this.dataset.wasChecked = this.checked;
        });
        radio.addEventListener('click', function (e) {
          if (this.dataset.wasChecked === 'true') {
            this.checked = false;
            delete this.dataset.wasChecked;
            e.preventDefault();
          }
        });
      });

      // BOTÓN "ELIMINAR FILTROS"
      document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
        // Reset visual
        document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        document.getElementById("precioRange").value = document.getElementById("precioRange").min;

        // Ocultar offcanvas
        const offEl = document.getElementById('offcanvasWithBothOptions');
        const off = bootstrap.Offcanvas.getInstance(offEl) || new bootstrap.Offcanvas(offEl);
        off.hide();

        // Redirigir sin parámetros
        window.location.href = 'productos.html';
      });

      // BOTÓN "ACEPTAR" → aplica filtros y redirige
      document.getElementById("clear")?.addEventListener("click", () => {
        const params = new URLSearchParams();

        // Categoría
        const cat = document.querySelector('input[name="categoria"]:checked');
        if (cat) {
          const label = document.querySelector(`label[for="${cat.id}"]`).innerText.trim();
          params.append('categoria', label);
        }

        // Talle
        const t = document.querySelector('input[name="talle"]:checked');
        if (t) params.append('talla', t.id);

        // Color
        const c = document.querySelector('input[name="color"]:checked');
        if (c) params.append('color', c.id);

        // Precio máximo
        const pr = document.getElementById('precioRange');
        if (pr && pr.value) params.append('precioMax', pr.value);

        // Ocultar offcanvas
        const offEl = document.getElementById('offcanvasWithBothOptions');
        const off = bootstrap.Offcanvas.getInstance(offEl) || new bootstrap.Offcanvas(offEl);
        off.hide();

        // Redirigir con filtros
        const query = params.toString();
        window.location.href = `productos.html${query ? '?' + query : ''}`;
      });
    });
});
