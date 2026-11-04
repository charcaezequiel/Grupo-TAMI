const API = window.TAMI_API_URL || "http://localhost:3000/api";
let currentUser = null;
let tokenActual = null;

function escaparHtml(valor) {
  return String(valor === null || valor === undefined ? "" : valor).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function cabecerasAdmin(extra) {
  return Object.assign(
    { "Content-Type": "application/json", Authorization: "Bearer " + (tokenActual || "") },
    extra || {}
  );
}

document.getElementById("loginAdminForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPass").value;
  const msg = document.getElementById("loginMsg");
  msg.textContent = "";
  try {
    const res = await fetch(API + "/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
    const usuario = data.usuario || data;
    if (!data.token) throw new Error("El servidor no devolvió una sesión válida.");
    const rol = String(usuario.role_name || "").toLowerCase();
    if (["superadmin", "moderador", "analista"].indexOf(rol) === -1) {
      throw new Error("Esta cuenta no tiene permisos para entrar al panel.");
    }
    currentUser = usuario;
    tokenActual = data.token;
    document.getElementById("loginView").style.display = "none";
    document.getElementById("adminView").style.display = "block";
    document.getElementById("adminRol").textContent =
      "Sesión: " + (usuario.nombre || usuario.email || "administrador") + " · Rol " + rol;

    const soloSuperadmin = rol === "superadmin";
    document.querySelectorAll("[data-solo-superadmin]").forEach(function (elemento) {
      elemento.hidden = !soloSuperadmin;
    });

    if (soloSuperadmin) {
      cargarDashboard();
      cargarUsuarios();
      cargarAuditoria();
    }
    cargarAyuda();
    cargarFeedback();
  } catch (err) {
    msg.textContent = err.message;
  }
});

async function cargarDashboard() {
  try {
    const res = await fetch(API + "/admin/dashboard", { headers: cabecerasAdmin() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    const grid = document.getElementById("statsGrid");
    grid.innerHTML = `
      <div class="admin-card"><h3>Usuarios</h3><div class="numero">${Number(data.resumen.usuarios) || 0}</div></div>
      <div class="admin-card"><h3>Cursos</h3><div class="numero">${Number(data.resumen.cursos) || 0}</div></div>
      <div class="admin-card"><h3>Alertas</h3><div class="numero">${Number(data.resumen.alertas) || 0}</div></div>
      <div class="admin-card"><h3>Auditoría 24h</h3><div class="numero">${Number(data.resumen.auditoria_24h) || 0}</div></div>
    `;
  } catch (err) {
    alert(err.message);
  }
}

async function cargarUsuarios() {
  try {
    const res = await fetch(API + "/admin/usuarios", { headers: cabecerasAdmin() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudieron cargar los usuarios");
    const tbody = document.getElementById("usuariosTable");
    tbody.innerHTML = data.map(function (u) {
      const rol = escaparHtml(u.role_name || "usuario");
      const clase = String(u.role_name || "usuario").replace(/[^a-z0-9_-]/gi, "");
      return `
      <tr>
        <td>${Number(u.id)}</td>
        <td>${escaparHtml(u.nombre)}</td>
        <td>${escaparHtml(u.email)}</td>
        <td><span class="badge badge-${clase}">${rol}</span></td>
        <td>${u.is_active ? ' Activo' : ' Inactivo'}</td>
        <td>${u.twofa_enabled ? 'Sí' : 'No'}</td>
        <td><button class="btn btn-primary" data-accion="estado" data-id="${Number(u.id)}" data-estado="${u.is_active ? "false" : "true"}">${u.is_active ? 'Desactivar' : 'Activar'}</button></td>
      </tr>
    `;
    }).join("");
    tbody.querySelectorAll('button[data-accion="estado"]').forEach(function (boton) {
      boton.addEventListener("click", function () {
        cambiarEstado(Number(boton.dataset.id), boton.dataset.estado === "true");
      });
    });
  } catch (err) {
    console.error(err);
  }
}

async function cambiarEstado(id, estado) {
  try {
    const res = await fetch(API + "/admin/usuarios/" + id + "/estado", {
      method: "PUT",
      headers: cabecerasAdmin(),
      body: JSON.stringify({ is_active: estado })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    alert(data.mensaje);
    cargarUsuarios();
  } catch (err) {
    alert(err.message);
  }
}

async function cargarAuditoria() {
  try {
    const res = await fetch(API + "/admin/auditoria?limite=50", { headers: cabecerasAdmin() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo cargar la auditoría");
    const tbody = document.getElementById("auditoriaTable");
    tbody.innerHTML = data.map(function (a) {
      return `
      <tr>
        <td>${escaparHtml(new Date(a.creado_en).toLocaleString('es-AR'))}</td>
        <td>${escaparHtml(a.nombre || 'N/A')} (${escaparHtml(a.email || '-')})</td>
        <td><strong>${escaparHtml(a.accion)}</strong></td>
        <td>${escaparHtml(a.detalle || '-')}</td>
        <td>${escaparHtml(a.ip || '-')}</td>
      </tr>
    `;
    }).join("");
  } catch (err) {
    console.error(err);
  }
}

const CATEGORIAS_AYUDA = {
  general: "Consulta general",
  cuenta: "Mi cuenta",
  curso: "Cursos y niveles",
  accesibilidad: "Accesibilidad",
  seguridad: "Seguridad y estafas"
};

function rolActual() {
  return String((currentUser && currentUser.role_name) || "").toLowerCase();
}

function puedeAtenderAyuda() {
  return rolActual() === "superadmin" || rolActual() === "moderador";
}

async function cargarAyuda() {
  const tbody = document.getElementById("ayudaTable");
  try {
    const res = await fetch(API + "/ayuda", { headers: cabecerasAdmin() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudieron cargar las solicitudes");

    const pendientes = data.filter(function (s) { return s.estado === "pendiente"; }).length;
    document.getElementById("ayudaPendientes").textContent = pendientes + (pendientes === 1 ? " pendiente" : " pendientes");

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="admin-vacio">Todavía no hay solicitudes de ayuda.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(function (s) {
      const categoria = CATEGORIAS_AYUDA[s.categoria] || s.categoria || "Consulta general";
      const estado = String(s.estado || "pendiente");
      const acciones = puedeAtenderAyuda()
        ? '<div class="admin-acciones">' +
            '<button class="btn btn-primary" data-ayuda-id="' + Number(s.id) + '" data-estado="en_proceso">En proceso</button>' +
            '<button class="btn btn-success" data-ayuda-id="' + Number(s.id) + '" data-estado="resuelto">Resuelto</button>' +
            '<button class="btn" style="background:#ECEFF1;color:#37474F" data-ayuda-id="' + Number(s.id) + '" data-estado="pendiente">Pendiente</button>' +
          '</div>'
        : "—";
      const contacto = s.email ? '<br><small>' + escaparHtml(s.email) + '</small>' : '';
      return `
      <tr>
        <td>${escaparHtml(new Date(s.creado_en).toLocaleString("es-AR"))}</td>
        <td>${escaparHtml(s.usuario_nombre || s.nombre)}${contacto}</td>
        <td>${escaparHtml(categoria)}</td>
        <td class="admin-mensaje">${escaparHtml(s.mensaje)}</td>
        <td><span class="badge badge-estado-${escaparHtml(estado)}">${escaparHtml(estado)}</span></td>
        <td>${acciones}</td>
      </tr>`;
    }).join("");

    tbody.querySelectorAll("button[data-ayuda-id]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        cambiarEstadoAyuda(Number(boton.dataset.ayudaId), boton.dataset.estado);
      });
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="admin-vacio">' + escaparHtml(err.message) + '</td></tr>';
  }
}

async function cambiarEstadoAyuda(id, estado) {
  try {
    const res = await fetch(API + "/ayuda/" + id + "/estado", {
      method: "PUT",
      headers: cabecerasAdmin(),
      body: JSON.stringify({ estado: estado })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo actualizar");
    cargarAyuda();
  } catch (err) {
    alert(err.message);
  }
}

async function cargarFeedback() {
  const tbody = document.getElementById("feedbackTable");
  try {
    const res = await fetch(API + "/feedback", { headers: cabecerasAdmin() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudieron cargar las opiniones");

    document.getElementById("feedbackTotal").textContent =
      data.length + (data.length === 1 ? " opinión" : " opiniones");

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="admin-vacio">Todavía no hay opiniones.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(function (f) {
      const puntaje = Math.max(1, Math.min(5, Number(f.puntaje) || 0));
      const estrellas = "★".repeat(puntaje) + "☆".repeat(5 - puntaje);
      return `
      <tr>
        <td>${escaparHtml(new Date(f.creado_en).toLocaleString("es-AR"))}</td>
        <td>${escaparHtml(f.usuario_nombre || "Persona sin cuenta")}</td>
        <td>${escaparHtml(f.pantalla || "-")}</td>
        <td><span class="admin-estrellas" title="${puntaje} de 5">${estrellas}</span></td>
        <td class="admin-mensaje">${escaparHtml(f.comentario || "—")}</td>
      </tr>`;
    }).join("");
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="admin-vacio">' + escaparHtml(err.message) + '</td></tr>';
  }
}

function logoutAdmin() {
  currentUser = null;
  tokenActual = null;
  document.getElementById("adminView").style.display = "none";
  document.getElementById("loginView").style.display = "block";
  document.getElementById("adminRol").textContent = "Control de Acceso Basado en Roles (RBAC)";
  document.querySelectorAll("[data-solo-superadmin]").forEach(function (elemento) {
    elemento.hidden = false;
  });
  ["statsGrid", "usuariosTable", "auditoriaTable", "ayudaTable", "feedbackTable"].forEach(function (id) {
    const contenedor = document.getElementById(id);
    if (contenedor) contenedor.innerHTML = "";
  });
  document.getElementById("loginAdminForm").reset();
}

document.getElementById("btn-logout-admin").addEventListener("click", logoutAdmin);
