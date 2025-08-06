// script.js

// --- FADE DE SECCIONES AL SCROLL ---
const secciones = document.querySelectorAll('.seccion');

const observerSeccion = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.5
});

secciones.forEach(seccion => observerSeccion.observe(seccion));

// --- ANIMACIÓN EVENTOS ---
const eventos = document.querySelectorAll('.evento');

const observerEvento = new IntersectionObserver(entries => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 300); // Delay progresivo
    }
  });
}, {
  threshold: 0.5
});

eventos.forEach(evento => observerEvento.observe(evento));

// --- CUENTA REGRESIVA ---
function iniciarCuentaRegresiva() {
  const cuenta = document.getElementById("cuenta");
  const fechaObjetivo = new Date("2025-08-15T00:00:00").getTime();

  function actualizarCuenta() {
    const ahora = new Date().getTime();
    const diferencia = fechaObjetivo - ahora;

    if (diferencia < 0) {
      cuenta.textContent = "¡Ya llegó el gran día!";
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    cuenta.textContent = `${dias} días, ${horas}h ${minutos}m ${segundos}s`;
  }

  actualizarCuenta();
  setInterval(actualizarCuenta, 1000);
}

iniciarCuentaRegresiva();


// Enviar formulario a Google Forms con POST sin recargar ni redireccionar
document.getElementById('form-asistencia').addEventListener('submit', function (e) {
  e.preventDefault();
  mostrarConfirmacion(); // LLAMADA
});

// --- ENVIAR A GOOGLE SHEETS ---
function mostrarConfirmacion() {
  const form = document.getElementById('form-asistencia');
  const nombre = form.querySelector('input[name="nombre"]').value.trim();
  const asistenciaInput = form.querySelector('input[name="asistencia"]:checked');

  if (!asistenciaInput || !nombre) {
    alert('Por favor completa el formulario antes de enviar.');
    return;
  }

  const asistencia = asistenciaInput.value;

  // MOSTRAR MENSAJE TEMPORAL
  const mensajeCarga = document.createElement('p');
  mensajeCarga.id = 'mensaje-carga';
  mensajeCarga.textContent = 'Estamos registrando tu respuesta...';
  mensajeCarga.style.fontWeight = 'bold';
  mensajeCarga.style.marginTop = '1em';
  mensajeCarga.style.color = '#234634';
  form.appendChild(mensajeCarga);

  // Enviar a Google Sheets
  fetch('https://script.google.com/macros/s/AKfycbxW2ZJwIB2GBtkTnaSARbrHglBqDfm9W9fvrZ_-wDUe9Wjyf492Rk3lnQZjRSwfdtfc/exec', {
    method: 'POST',
    body: new URLSearchParams({
      'nombre': nombre,
      'asistencia': asistencia
    })
  })
  .then(() => {
    // OCULTAR MENSAJE DE CARGA
    if (document.getElementById('mensaje-carga')) {
      document.getElementById('mensaje-carga').remove();
    }

    // MOSTRAR OPCIONES DE WHATSAPP
    document.getElementById('confirmacion-whatsapp').style.display = 'block';
  })
  .catch(() => {
    if (document.getElementById('mensaje-carga')) {
      document.getElementById('mensaje-carga').remove();
    }
    alert('Hubo un problema al enviar tus respuestas.');
  });
}
// --- CONFIRMACIÓN POR WHATSAPP ---
function confirmarWhatsapp(destino) {
  const form = document.getElementById('form-asistencia');
  const nombre = form.querySelector('input[name="nombre"]').value.trim();
  const asistenciaInput = form.querySelector('input[name="asistencia"]:checked');

  if (!asistenciaInput || !nombre) {
    alert('Por favor completa el formulario antes de confirmar por WhatsApp.');
    return;
  }

  const mensajeSi = "Gracias por la invitacion ahi estare!";
  const mensajeNo = "Gracias pero no podre acompañarlos, saludos!";
  const mensaje = asistenciaInput.value === "No" ? mensajeNo : mensajeSi;

  const numero = destino === 'claudia' ? '5216461517207' : '5216461515789';
  const mensajeFinal = `Hola, soy ${nombre}. ${mensaje}`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensajeFinal)}`;

  // Mostrar modal de GRACIAS
  const modal = document.getElementById('modal-gracias');
  modal.style.display = 'flex';

  // Esperar 2 segundos y redirigir
  setTimeout(() => {
    window.open(url, '_blank');
    modal.style.display = 'none';
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  // Ocultar portada tras clic
const portada = document.getElementById('portada');
document.body.addEventListener('click', () => {
  if (portada) {
    portada.style.opacity = '0';
    portada.style.transition = 'opacity 0.8s ease';
    setTimeout(() => portada.style.display = 'none', 800);
  }
}, { once: true });

  const audio = document.getElementById('bg-music');
  let iniciado = false;

  const iniciarMusica = () => {
    if (iniciado) return;

    audio.volume = 0.05;
    audio.play().then(() => {
      // Fade-in de 10 segundos
      const intervalo = setInterval(() => {
        if (audio.volume < 1) {
          audio.volume = Math.min(audio.volume + 0.1, 1);
        } else {
          clearInterval(intervalo);
        }
      }, 1000);
      iniciado = true;
    }).catch(err => {
      console.warn("Autoplay bloqueado:", err);
    });
  };

  // Reproducir tras primer clic
  document.body.addEventListener('click', iniciarMusica, { once: true });
});




