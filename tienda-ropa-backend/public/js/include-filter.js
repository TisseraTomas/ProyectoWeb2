document.addEventListener("DOMContentLoaded", () => {
  fetch("filter.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("filter-container").innerHTML = data;

      // Lógica que se ejecuta después de insertar los filtros:
      document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('mousedown', function (e) {
          if (this.checked) {
            this.dataset.wasChecked = true;
          } else {
            delete this.dataset.wasChecked;
          }
        });

        radio.addEventListener('click', function (e) {
          if (this.dataset.wasChecked) {
            this.checked = false;
            delete this.dataset.wasChecked;
            e.preventDefault();
          }
        });
      });

      document.getElementById("clearFiltersBtn")?.addEventListener("click", function () {
        document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        document.getElementById("precioRange").value = 2800;
        const offcanvasElement = document.getElementById('offcanvasWithBothOptions');
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
        offcanvas.hide();
      });

      document.getElementById("clear")?.addEventListener("click", function () {
        const offcanvasElement = document.getElementById('offcanvasWithBothOptions');
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
        offcanvas.hide();
      });
    });
});
