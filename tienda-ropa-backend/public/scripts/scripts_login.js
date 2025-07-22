document.addEventListener("DOMContentLoaded", () => {
  comprobarUsuario();
});

async function comprobarUsuario() {
  const container = document.getElementById('login-container');
  if (!container) return;

  try {
    const res = await fetch('http://localhost:3000/api/usuarios/perfil', {
      credentials: 'include'
    });

    if (res.ok) {
      const user = await res.json();
      mostrarPerfilEditable(user);
    } else {
      mostrarFormularios();
    }
  } catch (err) {
    console.error('Error al comprobar usuario:', err);
    mostrarFormularios();
  }
}

function mostrarFormularios() {
  const container = document.getElementById('login-container');
  container.innerHTML = `
    <h5 class="fw-bold text-center mb-4">Accedé o Registrate</h5>

    <div class="row">
      <!-- Registro -->
      <div class="col-md-6 mb-3">
        <div class="p-3 bg-light rounded h-100">
          <h6 class="fw-bold">Nuevo cliente</h6>
          <p class="small text-muted">Regístrate y consultá tus pedidos</p>
          <hr>
          <form id="formRegistro">
            <div class="mb-3">
              <label class="form-label">Email *</label>
              <input type="email" id="registroEmail" class="form-control form-control-sm" placeholder="email@ejemplo.com" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña *</label>
              <input type="password" id="registroPassword" class="form-control form-control-sm" placeholder="******" required>
            </div>
            <button type="submit" class="btn btn-dark w-100 btn-sm">REGISTRARSE</button>
          </form>
        </div>
      </div>

      <!-- Login -->
      <div class="col-md-6 mb-3">
        <div class="p-3 bg-light rounded h-100">
          <h6 class="fw-bold">Cliente registrado</h6>
          <p class="small text-muted">Accedé a tu cuenta y consultá tus pedidos</p>
          <hr>
          <form id="formLogin">
            <div class="mb-3">
              <label class="form-label">Email *</label>
              <input type="text" id="loginEmail" class="form-control form-control-sm" placeholder="usuario" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña *</label>
              <input type="password" id="loginPassword" class="form-control form-control-sm" placeholder="******" required>
            </div>
            <button type="submit" class="btn btn-dark w-100 btn-sm">ACCEDER</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Atachar eventos
  const formLogin = document.getElementById('formLogin');
  const formRegistro = document.getElementById('formRegistro');

  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#loginEmail').value;
    const contraseña = document.querySelector('#loginPassword').value;

    const res = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, contraseña })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Login correcto');
      comprobarUsuario(); // recarga estado
    } else {
      alert(data.error || 'Error en el login');
    }
  });

  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#registroEmail').value;
    const contraseña = document.querySelector('#registroPassword').value;

    const res = await fetch('http://localhost:3000/api/usuarios/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contraseña })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.mensaje || 'Registro exitoso');
      comprobarUsuario(); // recarga estado
    } else {
      alert(data.error || 'Error en el registro');
    }
  });
}

function mostrarPerfilEditable(user) {
  const container = document.getElementById('login-container');
  container.innerHTML = `
    <h5 class="fw-bold text-center mb-4">Mi Perfil</h5>

    <form id="formPerfil">
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input type="text" id="perfilNombre" class="form-control form-control-sm" value="${user.nombre || ''}">
      </div>
      <div class="mb-3">
        <label class="form-label">Apellido</label>
        <input type="text" id="perfilApellido" class="form-control form-control-sm" value="${user.apellido || ''}">
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" id="perfilEmail" class="form-control form-control-sm" value="${user.email}" readonly>
      </div>
      <div class="mb-3">
        <label class="form-label">Teléfono</label>
        <input type="text" id="perfilTelefono" class="form-control form-control-sm" value="${user.telefono || ''}">
      </div>
      <div class="mb-3">
        <label class="form-label">Dirección</label>
        <input type="text" id="perfilDireccion" class="form-control form-control-sm" value="${user.direccion || ''}">
      </div>

      <div class="d-flex justify-content-between">
        <button type="submit" class="btn btn-success btn-sm">Guardar cambios</button>
        <button type="button" id="cerrarSesionBtn" class="btn btn-danger btn-sm">Cerrar sesión</button>
      </div>
    </form>
  `;

  document.getElementById('cerrarSesionBtn').addEventListener('click', async () => {
    try {
      await fetch('http://localhost:3000/api/usuarios/logout', {
        method: 'POST',
        credentials: 'include'
      });
      comprobarUsuario();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  });

  const formPerfil = document.getElementById('formPerfil');
  formPerfil.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('perfilNombre').value;
    const apellido = document.getElementById('perfilApellido').value;
    const telefono = document.getElementById('perfilTelefono').value;
    const direccion = document.getElementById('perfilDireccion').value;

    const res = await fetch('http://localhost:3000/api/usuarios/perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombre, apellido, telefono, direccion })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.mensaje || 'Datos actualizados');
      comprobarUsuario(); // recarga estado
    } else {
      alert(data.error || 'Error al actualizar');
    }
  });
}

