/* ============================================================
   ESTRUCTURAS DE DATOS
   ============================================================ */
let carrito = [];
let usuariosInscritos = []; // Arreglo de objetos usuario
let carruselIndex = 0;
let carruselInterval;

// Datos de slides del carrusel
const slides = [
  { img: 'imagenes/chanel-No-5-Parfum.jpg',    caption: 'Chanel No.5 — Elegancia atemporal' },
  { img: 'imagenes/sauvage dior.jpg',           caption: 'Sauvage Dior — Frescura salvaje' },
  { img: 'imagenes/valentino born in roma.jpg', caption: 'Valentino Born in Roma — Pasion italiana' },
  { img: 'imagenes/versage eros energy.jpg',    caption: 'Versace Eros Energy — Intensidad masculina' },
  { img: 'imagenes/212 vip.jpg',                caption: '212 VIP — Glamour nocturno' },
];

/* ============================================================
   FUNCIONES DEL CARRUSEL (Criterio 2.1.1)
   ============================================================ */
function inicializarCarrusel() {
  var track = document.getElementById('carrusel-track');
  var dotsContainer = document.getElementById('carrusel-dots');
  track.innerHTML = '';
  dotsContainer.innerHTML = '';

  slides.forEach(function(slide, i) {
    var div = document.createElement('div');
    div.className = 'carrusel-slide';
    div.innerHTML =
      '<img src="' + slide.img + '" alt="' + slide.caption + '" onerror="this.src=\'https://via.placeholder.com/700x380/000000/d4af37?text=Fragancia\'">' +
      '<div class="carrusel-caption">' + slide.caption + '</div>';
    track.appendChild(div);

    var btn = document.createElement('button');
    btn.className = 'dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Ir a slide ' + (i + 1));
    btn.onclick = function() { irASlide(i); };
    dotsContainer.appendChild(btn);
  });

  actualizarCarrusel();
}

function cambiarImagen(direccion) {
  carruselIndex = (carruselIndex + direccion + slides.length) % slides.length;
  actualizarCarrusel();
}

function irASlide(index) {
  carruselIndex = index;
  actualizarCarrusel();
}

function actualizarCarrusel() {
  var track = document.getElementById('carrusel-track');
  track.style.transform = 'translateX(-' + (carruselIndex * 100) + '%)';
  document.querySelectorAll('.dot').forEach(function(dot, i) {
    dot.classList.toggle('active', i === carruselIndex);
  });
}

function iniciarAutoAvance() {
  carruselInterval = setInterval(function() { cambiarImagen(1); }, 4000);
}

function detenerAutoAvance() {
  clearInterval(carruselInterval);
}

/* ============================================================
   FUNCIONES DEL CARRITO (Criterios 2.1.3 y 2.1.4)
   ============================================================ */
function agregarCarrito(nombre, precio) {
  carrito.push({ nombre: nombre, precio: precio });
  actualizarDOM();
  abrirCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarDOM();
}

function actualizarDOM() {
  var lista    = document.getElementById('cart-items');
  var totalEl  = document.getElementById('total');
  var contador = document.getElementById('cart-count');

  lista.innerHTML = '';
  var total = 0;

  carrito.forEach(function(producto, index) {
    total += producto.precio;
    var li = document.createElement('li');
    li.innerHTML =
      '<span>' + producto.nombre + ' - $' + producto.precio.toLocaleString('es-CL') + '</span>' +
      '<button onclick="eliminarProducto(' + index + ')" title="Eliminar">&#10060;</button>';
    lista.appendChild(li);
  });

  totalEl.textContent = 'Total: $' + total.toLocaleString('es-CL') + ' CLP';
  contador.textContent = carrito.length;
}

function abrirCarrito()  { document.getElementById('cart-panel').classList.add('active'); }
function cerrarCarrito() { document.getElementById('cart-panel').classList.remove('active'); }

/* ============================================================
   FUNCIONES DE VALIDACION (Criterio 2.1.2)
   ============================================================ */
function esEmailValido(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

function esCampoVacio(valor) {
  return valor.trim() === '';
}

function mostrarError(idError, mensaje) {
  var el = document.getElementById(idError);
  if (el) el.textContent = mensaje;
}

function limpiarError(idError) {
  var el = document.getElementById(idError);
  if (el) el.textContent = '';
}

// validarDatos: recibe array de objetos { valor, idError, nombre, esEmail }
function validarDatos(campos) {
  var valido = true;
  campos.forEach(function(campo) {
    limpiarError(campo.idError);
    if (esCampoVacio(campo.valor)) {
      mostrarError(campo.idError, 'El campo ' + campo.nombre + ' es obligatorio.');
      valido = false;
    } else if (campo.esEmail && !esEmailValido(campo.valor)) {
      mostrarError(campo.idError, 'Ingresa un correo electronico valido.');
      valido = false;
    }
  });
  return valido;
}

/* ============================================================
   FORMULARIO DE INSCRIPCION (Criterios 2.1.2, 2.1.3)
   ============================================================ */
function procesarInscripcion() {
  var nombre   = document.getElementById('reg-nombre').value;
  var email    = document.getElementById('reg-email').value;
  var password = document.getElementById('reg-password').value;

  var esValido = validarDatos([
    { valor: nombre,   idError: 'err-reg-nombre',   nombre: 'Nombre' },
    { valor: email,    idError: 'err-reg-email',    nombre: 'Correo', esEmail: true },
    { valor: password, idError: 'err-reg-password', nombre: 'Contrasena' },
  ]);
  if (!esValido) return;

  var existe = usuariosInscritos.some(function(u) {
    return u.email === email.trim().toLowerCase();
  });
  if (existe) {
    mostrarError('err-reg-email', 'Este correo ya esta registrado.');
    return;
  }

  // Objeto usuario
  var nuevoUsuario = {
    nombre:   nombre.trim(),
    email:    email.trim().toLowerCase(),
    password: password,
    fechaReg: new Date().toLocaleDateString('es-CL'),
  };

  usuariosInscritos.push(nuevoUsuario);

  localStorage.setItem('mundoAroma_email',    nuevoUsuario.email);
  localStorage.setItem('mundoAroma_password', nuevoUsuario.password);
  localStorage.setItem('mundoAroma_nombre',   nuevoUsuario.nombre);

  document.getElementById('msg-inscripcion').textContent =
    'Registro exitoso. Bienvenido/a, ' + nuevoUsuario.nombre + '.';

  document.getElementById('reg-nombre').value   = '';
  document.getElementById('reg-email').value    = '';
  document.getElementById('reg-password').value = '';
}

/* ============================================================
   FORMULARIO DE LOGIN — MODAL (Criterio 2.1.2)
   ============================================================ */
function abrirLogin()  { document.getElementById('modal-login').classList.add('open'); }
function cerrarLogin() { document.getElementById('modal-login').classList.remove('open'); }

function iniciarSesion() {
  var email    = document.getElementById('login-email').value;
  var password = document.getElementById('login-password').value;

  var esValido = validarDatos([
    { valor: email,    idError: 'err-login-email',    nombre: 'Correo', esEmail: true },
    { valor: password, idError: 'err-login-password', nombre: 'Contrasena' },
  ]);
  if (!esValido) return;

  var savedEmail    = localStorage.getItem('mundoAroma_email');
  var savedPassword = localStorage.getItem('mundoAroma_password');
  var savedNombre   = localStorage.getItem('mundoAroma_nombre');

  if (email.trim().toLowerCase() === savedEmail && password === savedPassword) {
    localStorage.setItem('logueado', 'true');
    var nombre = savedNombre || email.split('@')[0];
    document.getElementById('usuario-box').innerHTML =
      '<span>Hola, ' + nombre + '</span>' +
      '<button onclick="cerrarSesion()">Salir</button>';
    cerrarLogin();
    document.getElementById('login-email').value    = '';
    document.getElementById('login-password').value = '';
    limpiarError('err-login-email');
    limpiarError('err-login-password');
  } else {
    mostrarError('err-login-password', 'Correo o contrasena incorrectos.');
  }
}

function cerrarSesion() {
  localStorage.removeItem('logueado');
  location.reload();
}

/* ============================================================
   FORMULARIO DE LOGIN — TAB (Criterio 2.1.2)
   ============================================================ */
function procesarLoginTab() {
  var email    = document.getElementById('tab-login-email').value;
  var password = document.getElementById('tab-login-password').value;

  var esValido = validarDatos([
    { valor: email,    idError: 'err-tab-login-email',    nombre: 'Correo', esEmail: true },
    { valor: password, idError: 'err-tab-login-password', nombre: 'Contrasena' },
  ]);
  if (!esValido) return;

  var savedEmail    = localStorage.getItem('mundoAroma_email');
  var savedPassword = localStorage.getItem('mundoAroma_password');
  var savedNombre   = localStorage.getItem('mundoAroma_nombre');

  if (email.trim().toLowerCase() === savedEmail && password === savedPassword) {
    localStorage.setItem('logueado', 'true');
    var nombre = savedNombre || email.split('@')[0];
    document.getElementById('usuario-box').innerHTML =
      '<span>Hola, ' + nombre + '</span>' +
      '<button onclick="cerrarSesion()">Salir</button>';
    document.getElementById('msg-login-tab').textContent =
      'Sesion iniciada. Bienvenido/a, ' + nombre + '!';
    document.getElementById('tab-login-email').value    = '';
    document.getElementById('tab-login-password').value = '';
  } else {
    mostrarError('err-tab-login-password', 'Correo o contrasena incorrectos.');
  }
}

/* ============================================================
   FORMULARIO DE CONTACTO (Criterio 2.1.2)
   ============================================================ */
function procesarContacto() {
  var nombre  = document.getElementById('contacto-nombre').value;
  var email   = document.getElementById('contacto-email').value;
  var mensaje = document.getElementById('contacto-mensaje').value;

  var esValido = validarDatos([
    { valor: nombre,  idError: 'err-contacto-nombre',  nombre: 'Nombre' },
    { valor: email,   idError: 'err-contacto-email',   nombre: 'Correo', esEmail: true },
    { valor: mensaje, idError: 'err-contacto-mensaje', nombre: 'Mensaje' },
  ]);
  if (!esValido) return;

  document.getElementById('msg-contacto').textContent =
    'Mensaje enviado. Te responderemos a la brevedad.';

  document.getElementById('contacto-nombre').value  = '';
  document.getElementById('contacto-email').value   = '';
  document.getElementById('contacto-mensaje').value = '';
}

/* ============================================================
   TABS DE FORMULARIOS
   ============================================================ */
function cambiarFormTab(tab) {
  document.querySelectorAll('.form-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.form-panel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelector('.form-tab[data-tab="' + tab + '"]').classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
}

/* ============================================================
   INICIALIZACION
   ============================================================ */
window.onload = function() {
  inicializarCarrusel();
  iniciarAutoAvance();

  var logueado = localStorage.getItem('logueado');
  var email    = localStorage.getItem('mundoAroma_email');
  var nombre   = localStorage.getItem('mundoAroma_nombre');

  if (logueado === 'true' && email) {
    var displayNombre = nombre || email.split('@')[0];
    document.getElementById('usuario-box').innerHTML =
      '<span>Hola, ' + displayNombre + '</span>' +
      '<button onclick="cerrarSesion()">Salir</button>';
  }
};