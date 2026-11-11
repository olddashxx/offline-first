// =========================================================
// SCRIPT PRINCIPAL DEL PORTAFOLIO - GABRIEL GARAY (PWA & DOM)
// =========================================================

// Registro de Service Worker PWA (Funcionamiento Offline y App Instalable)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[PWA] Service Worker registrado exitosamente con alcance:', reg.scope))
            .catch(err => console.log('[PWA] Error al registrar Service Worker:', err));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    inicializarMenuHamburguesa();
    inicializarModoPWA();
    inicializarFiltro3CapasPWA();
    inicializarCentralizacionSecciones();
    inicializarDobleSeleccionMusica();
    inicializarFiltrosMultinivel();
    inicializarFormularioContacto();
});

// ==========================================
// EJEMPLO 1: Modo Claro / Modo Oscuro (con persistencia)
// ==========================================
function inicializarTema() {
    const themeBtn = document.getElementById('themeBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    const actualizarUI = (esLuz) => {
        if (!themeIcon || !themeText) return;
        if (esLuz) {
            themeIcon.className = 'bi bi-moon-fill';
            themeText.textContent = 'Modo Oscuro';
        } else {
            themeIcon.className = 'bi bi-sun-fill';
            themeText.textContent = 'Modo Claro';
        }
    };

    // Cargar preferencia guardada
    const temaGuardado = localStorage.getItem('gabriel_theme');
    if (temaGuardado === 'light') {
        document.body.classList.add('light-mode');
        actualizarUI(true);
    } else {
        actualizarUI(false);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const esLuz = document.body.classList.contains('light-mode');
            localStorage.setItem('gabriel_theme', esLuz ? 'light' : 'dark');
            actualizarUI(esLuz);
        });
    }
}

// ==========================================
// 1. MENÚ HAMBURGUESA CON JQUERY SLIDETOGGLE (Guía Oficial PWA)
// ==========================================
function inicializarMenuHamburguesa() {
    if (window.jQuery) {
        $('#burguerBtn, #hamburgerBtn').off('click').on('click', function (e) {
            e.stopPropagation();
            $('#navMenu').slideToggle(300);
        });
    } else {
        const burguerBtn = document.getElementById('burguerBtn');
        const navMenu = document.getElementById('navMenu');
        if (burguerBtn && navMenu) {
            burguerBtn.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });
        }
    }
}

function cerrarMenu() {
    if (window.jQuery) {
        $('#navMenu').slideUp(250);
    } else {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('show');
        }
    }
}
window.cerrarMenu = cerrarMenu;

// ==========================================
// 2. MODO SIMULACIÓN PWA (Móvil / Tablet 768px - Guía Técnica Docente)
// ==========================================
function inicializarModoPWA() {
    const pwaBtn = document.getElementById('pwaSimBtn');

    // Detección automática en dispositivos táctiles reales (Método B del docente)
    const esDispositivoMovil = window.innerWidth <= 768 || /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (esDispositivoMovil) {
        document.body.classList.add('pwa-simulated-mode');
        if (pwaBtn) pwaBtn.classList.add('active');
    }

    if (pwaBtn) {
        pwaBtn.addEventListener('click', () => {
            document.body.classList.toggle('pwa-simulated-mode');
            const activo = document.body.classList.contains('pwa-simulated-mode');
            pwaBtn.classList.toggle('active', activo);
        });
    }
}

// ==========================================
// 3. FILTRO DINÁMICO DE 3 CAPAS EN CASCADA CON JQUERY (Guía Oficial PWA)
// ==========================================
function inicializarFiltro3CapasPWA() {
    if (!window.jQuery) return;

    // Capa 1 -> Capa 2
    $('#capa1').change(function () {
        let valor = $(this).val();
        let $capa2 = $('#capa2');

        $capa2.html('<option value="">-- Seleccione opción --</option>').prop('disabled', false);

        if (valor === 'academico') {
            $capa2.append('<option value="web2">Diseño Web II (SIS-0141)</option>');
            $capa2.append('<option value="prog">Programación Avanzada</option>');
        } else if (valor === 'desarrollo') {
            $capa2.append('<option value="pwa">Arquitectura PWA</option>');
            $capa2.append('<option value="movil">Apps Móviles</option>');
        } else {
            $capa2.prop('disabled', true);
            $('#resultadoFiltro').text('Seleccione las capas anteriores...');
        }
    });

    // Capa 2 -> Capa 3
    $('#capa2').change(function () {
        let seleccion = $(this).find('option:selected').text();
        if (seleccion && $(this).val()) {
            $('#resultadoFiltro').html('<b>Elemento activo (Capa 3):</b> ' + seleccion);
        } else {
            $('#resultadoFiltro').text('Seleccione las capas anteriores...');
        }
    });
}

// ==========================================
// SECCIONES COMPRIMIDAS + CENTRALIZAR Y DESCENTRALIZAR EN PANTALLA
// ==========================================
let seccionCentralizadaActual = null;
let placeholderSeccion = null;

function centralizarSeccion(seccionId) {
    const seccion = document.getElementById(seccionId);
    if (!seccion) return;

    // Si otra sección estaba centralizada, descentralizarla primero
    if (seccionCentralizadaActual && seccionCentralizadaActual !== seccionId) {
        descentralizarSeccion(seccionCentralizadaActual);
    }

    if (seccion.classList.contains('is-centralized')) return;

    // Crear un contenedor temporal en el lateral para conservar el espacio exacto de la tarjeta
    const alturaOriginal = seccion.offsetHeight;
    placeholderSeccion = document.createElement('div');
    placeholderSeccion.id = `placeholder-${seccionId}`;
    placeholderSeccion.style.minHeight = `${alturaOriginal}px`;
    placeholderSeccion.className = 'section-placeholder-slot';
    seccion.parentNode.insertBefore(placeholderSeccion, seccion);

    // Aplicar estado centralizado en toda la pantalla
    seccion.classList.remove('is-compressed');
    seccion.classList.add('is-centralized');
    seccion.scrollTop = 0;

    // Actualizar insignia de estado
    const badgeEstado = seccion.querySelector('.badge-compression-state');
    if (badgeEstado) {
        badgeEstado.innerHTML = '<i class="bi bi-bullseye me-1"></i>Centralizado en Pantalla';
    }

    // Mostrar fondo oscuro y bloquear scroll del body
    const backdrop = document.getElementById('pantallaCentralBackdrop');
    if (backdrop) {
        backdrop.classList.add('active');
    }
    document.body.classList.add('central-modal-open');

    seccionCentralizadaActual = seccionId;
}

function descentralizarSeccion(seccionId) {
    const idObjetivo = seccionId || seccionCentralizadaActual;
    if (!idObjetivo) return;

    const seccion = document.getElementById(idObjetivo);
    if (!seccion) return;

    // Volver al estado comprimido normal en la página
    seccion.classList.remove('is-centralized');
    seccion.classList.add('is-compressed');

    // Actualizar insignia de estado
    const badgeEstado = seccion.querySelector('.badge-compression-state');
    if (badgeEstado) {
        badgeEstado.innerHTML = '<i class="bi bi-arrows-angle-contract me-1"></i>Información Comprimida';
    }

    // Eliminar el placeholder temporal
    if (placeholderSeccion && placeholderSeccion.parentNode) {
        placeholderSeccion.parentNode.removeChild(placeholderSeccion);
        placeholderSeccion = null;
    }

    // Ocultar fondo oscuro y restaurar scroll del body
    const backdrop = document.getElementById('pantallaCentralBackdrop');
    if (backdrop) {
        backdrop.classList.remove('active');
    }
    document.body.classList.remove('central-modal-open');

    seccionCentralizadaActual = null;
}

function descentralizarSeccionActiva() {
    if (seccionCentralizadaActual) {
        descentralizarSeccion(seccionCentralizadaActual);
    }
}

// 1. Funciones específicas para sección Proyectos Destacados
function centralizarProyectos() {
    centralizarSeccion('proyectos');
}
function descentralizarProyectos() {
    descentralizarSeccion('proyectos');
}

// 2. Funciones específicas para sección Mis Pasatiempos
function centralizarPasatiempos() {
    centralizarSeccion('pasatiempos');
}
function descentralizarPasatiempos() {
    descentralizarSeccion('pasatiempos');
}

// 3. Funciones específicas para sección Intereses y Desarrollo Profesional
function centralizarIntereses() {
    centralizarSeccion('intereses');
}
function descentralizarIntereses() {
    descentralizarSeccion('intereses');
}

// 4. Funciones específicas para sección Gaming & Música Favorita
function centralizarGustos() {
    centralizarSeccion('gustos');
}
function descentralizarGustos() {
    descentralizarSeccion('gustos');
}

// 5. Funciones específicas para sección Mi Horario y Organización Semanal
function centralizarHorario() {
    centralizarSeccion('horario');
}
function descentralizarHorario() {
    descentralizarSeccion('horario');
}

// 6. Funciones específicas para sección Registro Académico & Contacto Directo
function centralizarContacto() {
    centralizarSeccion('contacto');
}
function descentralizarContacto() {
    descentralizarSeccion('contacto');
}

function inicializarCentralizacionSecciones() {
    // Permitir descentralizar presionando la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && seccionCentralizadaActual) {
            descentralizarSeccionActiva();
        }
    });

    // Al hacer clic en un anclaje del menú hamburguesa, centralizar la sección elegida (o volver al inicio)
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const hash = link.getAttribute('href');
            if (!hash || hash === '#') return;
            const idSeccion = hash.replace('#', '');
            if (idSeccion === 'inicio') {
                e.preventDefault();
                descentralizarSeccionActiva();
            } else {
                const targetSec = document.getElementById(idSeccion);
                if (targetSec && targetSec.classList.contains('section-compressed-card')) {
                    e.preventDefault();
                    centralizarSeccion(idSeccion);
                }
            }
        });
    });
}

// Exponer funciones globalmente para eventos onclick en el HTML
window.centralizarSeccion = centralizarSeccion;
window.descentralizarSeccion = descentralizarSeccion;
window.descentralizarSeccionActiva = descentralizarSeccionActiva;
window.centralizarProyectos = centralizarProyectos;
window.descentralizarProyectos = descentralizarProyectos;
window.centralizarPasatiempos = centralizarPasatiempos;
window.descentralizarPasatiempos = descentralizarPasatiempos;
window.centralizarIntereses = centralizarIntereses;
window.descentralizarIntereses = descentralizarIntereses;
window.centralizarGustos = centralizarGustos;
window.descentralizarGustos = descentralizarGustos;
window.centralizarHorario = centralizarHorario;
window.descentralizarHorario = descentralizarHorario;
window.centralizarContacto = centralizarContacto;
window.descentralizarContacto = descentralizarContacto;
window.inicializarCentralizacionSecciones = inicializarCentralizacionSecciones;

// ==========================================
// REQUISITO 1 DOCENTE: Doble Selección (Música: Romántica [Chayanne, Ricardo Arjona])
// ==========================================
const datosMusicaDobleSeleccion = {
    romantica: {
        nombre: "Romántica",
        artistas: [
            {
                id: "chayanne",
                nombre: "Chayanne",
                canciones: "Dejaría Todo • Torero • Un Siglo Sin Ti • Y Tú Te Vas",
                descripcion: "Ícono absoluto del pop latino y la balada romántica. Con décadas de trayectoria, sus letras apasionadas y energía escénica han marcado a generaciones enteras de oyentes en toda Latinoamérica.",
                imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/45/eb/eb/45ebebe8-8eab-ccdc-e610-0b029b02ceb3/mzi.flmctplg.jpg/400x400bb.jpg",
                tags: ["Romántica Clásica", "Balada Pop", "Latino"]
            },
            {
                id: "arjona",
                nombre: "Ricardo Arjona",
                canciones: "Historia de Taxi • Fuiste Tú • El Problema • Señora de las Cuatro Décadas",
                descripcion: "Cantautor y poeta guatemalteco célebre por su lírica introspectiva, narrativas urbanas de desamor y reflexiones profundas en formato de trova acústica y balada.",
                imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1c/5d/9c/1c5d9cd7-465f-4625-1597-d041edaf7070/823375476696_Cover.jpg/400x400bb.jpg",
                tags: ["Trova Romántica", "Poesía Urbana", "Balada"]
            }
        ]
    },
    indie: {
        nombre: "Indie / Dream Pop",
        artistas: [
            {
                id: "cuco",
                nombre: "Cuco",
                canciones: "Lover Is a Day • Hydrocodone • Bossa No Sé • Amor de Siempre",
                descripcion: "Pionero del bedroom pop y dream pop bilingüe. Atmósferas vintage, sintetizadores melancólicos y trompetas suaves perfectas para concentrarse programando.",
                imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/75/cc/b7/75ccb720-1e2f-37c2-4b6c-a91dddcaf872/22UMGIM34482.rgb.jpg/400x400bb.jpg",
                tags: ["Dream Pop", "BedRoom Pop", "Para Programar"]
            },
            {
                id: "mac-demarco",
                nombre: "Mac DeMarco",
                canciones: "Chamber of Reflection • My Kind of Woman • Salad Days",
                descripcion: "Guitarras analógicas con efecto chorus y ritmos slacker rock relajados que brindan calma ideal tras largas horas de código y universidad.",
                imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e0/04/eb/e004eb2b-754f-4a76-9ecc-87d4eea2a327/cover.jpg/400x400bb.jpg",
                tags: ["Slacker Rock", "Indie Chill", "Relajación"]
            }
        ]
    },
    rock: {
        nombre: "Rock en Español / Clásico",
        artistas: [
            {
                id: "soda",
                nombre: "Soda Stereo / Gustavo Cerati",
                canciones: "De Música Ligera • Trátame Suavemente • Crimen • Puente",
                descripcion: "La banda más influyente del rock hispanoamericano. Guitarras envolventes, vanguardia sonora y poesía que inspiran creatividad estructural.",
                imagen: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
                tags: ["Rock Latino", "Clásicos", "Guitarras"]
            }
        ]
    },
    gym: {
        nombre: "Gym / Phonk & Energía",
        artistas: [
            {
                id: "phonk",
                nombre: "Gym Phonk & Heavy Beats",
                canciones: "Kordhell • Ghostemane • DVRST • Metamorphosis",
                descripcion: "Ritmos de alto BPM, bajos profundos y distorsión que elevan la adrenalina y concentración durante mis 6 días de fuerza en el gimnasio.",
                imagen: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
                tags: ["Entrenamiento Pesado", "Fuerza 6 Días", "Alta Intensidad"]
            }
        ]
    }
};

function inicializarDobleSeleccionMusica() {
    const selectGenero = document.getElementById('selectGenero');
    const selectArtista = document.getElementById('selectArtista');
    const resultadoBox = document.getElementById('resultadoDobleSeleccion');

    if (!selectGenero || !selectArtista) return;

    // Evento al cambiar Género (Primer Select)
    selectGenero.addEventListener('change', () => {
        const generoSeleccionado = selectGenero.value;

        // Resetear el segundo select con manipulación del DOM
        selectArtista.innerHTML = '';

        if (!generoSeleccionado || !datosMusicaDobleSeleccion[generoSeleccionado]) {
            selectArtista.disabled = true;
            const optDefault = document.createElement('option');
            optDefault.value = '';
            optDefault.textContent = '-- Primero elige un género arriba --';
            selectArtista.appendChild(optDefault);
            if (resultadoBox) {
                resultadoBox.style.display = 'none';
                resultadoBox.innerHTML = '';
            }
            return;
        }

        // Poblar el segundo select mediante createElement del DOM
        selectArtista.disabled = false;
        const optPrompt = document.createElement('option');
        optPrompt.value = '';
        optPrompt.textContent = `-- Selecciona un artista de ${datosMusicaDobleSeleccion[generoSeleccionado].nombre} --`;
        selectArtista.appendChild(optPrompt);

        const listaArtistas = datosMusicaDobleSeleccion[generoSeleccionado].artistas;
        listaArtistas.forEach(art => {
            const option = document.createElement('option');
            option.value = art.id;
            option.textContent = `${art.nombre} (${art.tags[0]})`;
            selectArtista.appendChild(option);
        });

        if (resultadoBox) {
            resultadoBox.style.display = 'none';
            resultadoBox.innerHTML = '';
        }
    });

    // Evento al cambiar Artista (Segundo Select - Doble Selección)
    selectArtista.addEventListener('change', () => {
        const generoSeleccionado = selectGenero.value;
        const artistaId = selectArtista.value;

        if (!resultadoBox) return;

        if (!generoSeleccionado || !artistaId || !datosMusicaDobleSeleccion[generoSeleccionado]) {
            resultadoBox.style.display = 'none';
            resultadoBox.innerHTML = '';
            return;
        }

        const artistaData = datosMusicaDobleSeleccion[generoSeleccionado].artistas.find(a => a.id === artistaId);
        if (!artistaData) return;

        // Renderizar tarjeta reactiva en el DOM
        resultadoBox.style.display = 'block';
        resultadoBox.innerHTML = `
      <div class="doble-seleccion-result">
        <div class="d-flex flex-column flex-md-row gap-3 align-items-center align-items-md-start">
          <img src="${artistaData.imagen}" alt="${artistaData.nombre}" class="result-artist-cover">
          <div class="flex-grow-1 text-center text-md-start">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <h4 class="card-title m-0 text-cyan"><i class="bi bi-disc me-2"></i>${artistaData.nombre}</h4>
              <span class="badge badge-highlight text-uppercase">Doble Selección Activa</span>
            </div>
            <p class="text-warning fw-semibold small mb-2"><i class="bi bi-music-note-beamed me-1"></i>Éxitos representativos: ${artistaData.canciones}</p>
            <p class="card-text small mb-3">${artistaData.descripcion}</p>
            <div class="d-flex gap-2 flex-wrap justify-content-center justify-content-md-start">
              ${artistaData.tags.map(t => `<span class="badge badge-tech">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    });
}
window.inicializarDobleSeleccionMusica = inicializarDobleSeleccionMusica;

// ==========================================
// EJEMPLO 2 (AMPLIADO): Sistema de Filtrado Multinivel
// Aplicado a Proyectos, Pasatiempos, Intereses, Juegos y Música
// ==========================================
const estadoFiltros = {};

function inicializarFiltrosMultinivel() {
    const secciones = document.querySelectorAll('[data-filter-section]');

    secciones.forEach(seccion => {
        const sectionId = seccion.getAttribute('data-filter-section');
        estadoFiltros[sectionId] = {
            nivel1: 'todos',
            nivel2: 'todos',
            busqueda: ''
        };

        // Botones Nivel 1
        const botonesN1 = seccion.querySelectorAll('[data-filter-level="1"]');
        botonesN1.forEach(btn => {
            btn.addEventListener('click', () => {
                botonesN1.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                estadoFiltros[sectionId].nivel1 = btn.getAttribute('data-filter-value');
                aplicarFiltroSeccion(seccion, sectionId);
            });
        });

        // Botones Nivel 2
        const botonesN2 = seccion.querySelectorAll('[data-filter-level="2"]');
        botonesN2.forEach(btn => {
            btn.addEventListener('click', () => {
                botonesN2.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                estadoFiltros[sectionId].nivel2 = btn.getAttribute('data-filter-value');
                aplicarFiltroSeccion(seccion, sectionId);
            });
        });

        // Botón restablecer filtros
        const btnReset = seccion.querySelector('[data-filter-reset]');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                estadoFiltros[sectionId] = { nivel1: 'todos', nivel2: 'todos' };
                botonesN1.forEach((b, idx) => b.classList.toggle('active', idx === 0));
                botonesN2.forEach((b, idx) => b.classList.toggle('active', idx === 0));
                aplicarFiltroSeccion(seccion, sectionId);
            });
        }

        // Inicializar conteo
        aplicarFiltroSeccion(seccion, sectionId);
    });
}

function aplicarFiltroSeccion(seccion, sectionId) {
    const { nivel1, nivel2 } = estadoFiltros[sectionId];
    const items = seccion.querySelectorAll('[data-item-filtrable]');
    const contadorEl = seccion.querySelector('[data-filter-count]');
    const vacioEl = seccion.querySelector('[data-filter-empty]');

    let visibles = 0;

    items.forEach(item => {
        const itemN1 = (item.getAttribute('data-nivel1') || item.getAttribute('data-categoria') || '').toLowerCase();
        const itemN2 = (item.getAttribute('data-nivel2') || '').toLowerCase();

        const coincideN1 = nivel1 === 'todos' || itemN1.split(' ').includes(nivel1);
        const coincideN2 = nivel2 === 'todos' || itemN2.split(' ').includes(nivel2);

        if (coincideN1 && coincideN2) {
            item.style.display = '';
            visibles++;
        } else {
            item.style.display = 'none';
        }
    });

    if (contadorEl) {
        contadorEl.textContent = `Mostrando ${visibles} de ${items.length}`;
    }

    if (vacioEl) {
        vacioEl.style.display = visibles === 0 ? 'block' : 'none';
    }
}

// Función compatible con llamadas directas onclick="filtrarJuegos(...)"
function filtrarJuegos(categoria, botonActivo) {
    const seccionJuegos = document.querySelector('[data-filter-section="juegos"]');
    if (seccionJuegos && botonActivo) {
        botonActivo.click();
    }
}
window.filtrarJuegos = filtrarJuegos;

// ==========================================
// REQUISITO 4 DOCENTE: Formulario con Todas las Validaciones (jQuery & DOM)
// ==========================================
function inicializarFormularioContacto() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nombreInput = document.getElementById('nombre');
    const correoInput = document.getElementById('correo');
    const fechaInput = document.getElementById('fecha');
    const celularInput = document.getElementById('celular');
    const carreraSelect = document.getElementById('carrera');
    const semestreInput = document.getElementById('semestre');
    const mensajeInput = document.getElementById('mensaje');
    const submitBtn = document.getElementById('submitBtn');
    const alertaBox = document.getElementById('alertaBox');

    // Asegurar que el botón esté activo para permitir validar al hacer clic
    if (submitBtn) {
        submitBtn.disabled = false;
    }

    function aplicarFeedback(input, idError, idVal, esValido, mensajeError, mensajeValido) {
        const errorEl = document.getElementById(idError);
        const valEl = document.getElementById(idVal);

        if (esValido) {
            input.classList.remove('input-invalido', 'is-invalid');
            input.classList.add('input-valido', 'is-valid');
            if (errorEl) errorEl.innerHTML = '';
            if (valEl) valEl.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${mensajeValido}`;
        } else {
            input.classList.remove('input-valido', 'is-valid');
            input.classList.add('input-invalido', 'is-invalid');
            if (valEl) valEl.innerHTML = '';
            if (errorEl) errorEl.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${mensajeError}`;
        }
    }

    // 1. Nombre Completo (Guía PWA Oficial con jQuery fadeIn / fadeOut)
    function validarNombre(mostrarFeedback = true) {
        const val = nombreInput ? nombreInput.value.trim() : '';
        let valido = true;
        let mensaje = '';

        if (!val) {
            valido = false;
            mensaje = 'El nombre completo es obligatorio.';
        } else if (val.length < 3) {
            valido = false;
            mensaje = `Debe tener al menos 3 caracteres (actual: ${val.length}).`;
        } else if (val.length > 60) {
            valido = false;
            mensaje = 'El nombre no puede exceder los 60 caracteres.';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\.]+$/.test(val)) {
            valido = false;
            mensaje = 'Solo se admiten letras y espacios (sin números ni símbolos extraños).';
        }

        if (mostrarFeedback && nombreInput) {
            aplicarFeedback(nombreInput, 'err-nombre', 'val-nombre', valido, mensaje, 'Nombre verificado');
            if (window.jQuery) {
                if (!valido) {
                    $('#errNombre').fadeIn();
                } else {
                    $('#errNombre').fadeOut();
                }
            }
        }
        return valido;
    }

    // 2. Correo Electrónico (Guía PWA Oficial con regex y jQuery fadeIn / fadeOut)
    function validarCorreo(mostrarFeedback = true) {
        const val = correoInput ? correoInput.value.trim() : '';
        let valido = true;
        let mensaje = '';
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!val) {
            valido = false;
            mensaje = 'El correo electrónico es obligatorio.';
        } else if (!regexEmail.test(val)) {
            valido = false;
            mensaje = 'Ingrese un formato de correo electrónico válido (ej. nombre@upds.net.bo).';
        }

        if (mostrarFeedback && correoInput) {
            aplicarFeedback(correoInput, 'err-correo', 'val-correo', valido, mensaje, 'Correo verificado');
            if (window.jQuery) {
                if (!valido) {
                    $('#errCorreo').fadeIn();
                } else {
                    $('#errCorreo').fadeOut();
                }
            }
        }
        return valido;
    }

    // 3. Fecha de Registro
    function validarFecha(mostrarFeedback = true) {
        const val = fechaInput ? fechaInput.value : '';
        let valido = true;
        let mensaje = '';

        if (!val) {
            valido = false;
            mensaje = 'Debes seleccionar una fecha de registro en el calendario.';
        } else {
            const anio = parseInt(val.split('-')[0], 10);
            if (isNaN(anio) || anio < 1980 || anio > 2035) {
                valido = false;
                mensaje = 'Selecciona una fecha válida con año realista.';
            }
        }

        if (mostrarFeedback && fechaInput) {
            aplicarFeedback(fechaInput, 'err-fecha', 'val-fecha', valido, mensaje, 'Fecha confirmada');
        }
        return valido;
    }

    // 4. Celular (8 dígitos - Bolivia)
    function validarCelular(mostrarFeedback = true) {
        const val = celularInput ? celularInput.value.trim() : '';
        let valido = true;
        let mensaje = '';

        if (!val) {
            valido = false;
            mensaje = 'El número de celular es obligatorio.';
        } else if (!/^\d+$/.test(val)) {
            valido = false;
            mensaje = 'Solo se permiten dígitos numéricos (sin letras ni guiones).';
        } else if (val.length !== 8) {
            valido = false;
            mensaje = `Debe contener exactamente 8 dígitos bolivianos (actual: ${val.length}).`;
        } else if (!/^[67]/.test(val)) {
            valido = false;
            mensaje = 'En Bolivia los números celulares inician con 6 o 7 (ej. 60120550).';
        }

        if (mostrarFeedback && celularInput) {
            aplicarFeedback(celularInput, 'err-celular', 'val-celular', valido, mensaje, 'Celular boliviano válido (+591)');
        }
        return valido;
    }

    // 5. Carrera Universitaria
    function validarCarrera(mostrarFeedback = true) {
        const val = carreraSelect ? carreraSelect.value : '';
        let valido = true;
        let mensaje = '';

        if (!val) {
            valido = false;
            mensaje = 'Por favor selecciona tu carrera universitaria de la lista desplegable.';
        }

        if (mostrarFeedback && carreraSelect) {
            aplicarFeedback(carreraSelect, 'err-carrera', 'val-carrera', valido, mensaje, `Carrera seleccionada: ${val}`);
        }
        return valido;
    }

    // 6. Semestre Actual (1 al 10)
    function validarSemestre(mostrarFeedback = true) {
        const val = semestreInput ? semestreInput.value.trim() : '';
        let valido = true;
        let mensaje = '';

        if (!val) {
            valido = false;
            mensaje = 'El semestre actual es obligatorio.';
        } else {
            const num = parseInt(val, 10);
            if (isNaN(num) || num < 1 || num > 10) {
                valido = false;
                mensaje = 'Debe ser un número entero entre 1 y 10 (rango universitario).';
            }
        }

        if (mostrarFeedback && semestreInput) {
            aplicarFeedback(semestreInput, 'err-semestre', 'val-semestre', valido, mensaje, `Semestre ${val}º registrado`);
        }
        return valido;
    }

    // 7. Mensaje o Requerimiento (Guía PWA Oficial con jQuery fadeIn / fadeOut)
    function validarMensaje(mostrarFeedback = true) {
        const val = mensajeInput ? mensajeInput.value.trim() : '';
        let valido = true;
        let mensaje = '';

        if (!val) {
            valido = false;
            mensaje = 'El mensaje no puede estar vacío.';
        } else if (val.length < 5) {
            valido = false;
            mensaje = `Debe tener al menos 5 caracteres (actual: ${val.length}).`;
        }

        if (mostrarFeedback && mensajeInput) {
            aplicarFeedback(mensajeInput, 'err-mensaje', 'val-mensaje', valido, mensaje, 'Mensaje verificado');
            if (window.jQuery) {
                if (!valido) {
                    $('#errMensaje').fadeIn();
                } else {
                    $('#errMensaje').fadeOut();
                }
            }
        }
        return valido;
    }

    // Listeners reactivos
    if (nombreInput) {
        nombreInput.addEventListener('input', () => validarNombre(true));
        nombreInput.addEventListener('blur', () => validarNombre(true));
    }

    if (correoInput) {
        correoInput.addEventListener('input', () => validarCorreo(true));
        correoInput.addEventListener('blur', () => validarCorreo(true));
    }

    if (fechaInput) {
        ['input', 'change', 'blur'].forEach(evt => {
            fechaInput.addEventListener(evt, () => validarFecha(true));
        });
    }

    if (celularInput) {
        celularInput.addEventListener('input', () => validarCelular(true));
        celularInput.addEventListener('blur', () => validarCelular(true));
    }

    if (carreraSelect) {
        ['change', 'blur'].forEach(evt => {
            carreraSelect.addEventListener(evt, () => validarCarrera(true));
        });
    }

    if (semestreInput) {
        semestreInput.addEventListener('input', () => validarSemestre(true));
        semestreInput.addEventListener('blur', () => validarSemestre(true));
    }

    if (mensajeInput) {
        mensajeInput.addEventListener('input', () => validarMensaje(true));
        mensajeInput.addEventListener('blur', () => validarMensaje(true));
    }

    // Envío y validación completa
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const okNombre = validarNombre(true);
        const okCorreo = validarCorreo(true);
        const okFecha = validarFecha(true);
        const okCelular = validarCelular(true);
        const okCarrera = validarCarrera(true);
        const okSemestre = validarSemestre(true);
        const okMensaje = validarMensaje(true);

        const todoValido = okNombre && okCorreo && okFecha && okCelular && okCarrera && okSemestre && okMensaje;

        if (!todoValido) {
            if (alertaBox) {
                alertaBox.innerHTML = `
          <div class="alert alert-danger border-0 shadow-sm" role="alert">
            <h6 class="alert-heading fw-bold mb-1"><i class="bi bi-exclamation-triangle-fill me-2"></i>Formulario incompleto o con errores</h6>
            <p class="mb-0 small">Por favor revisa y corrige los campos señalados en rojo para registrar tus datos universitarios correctamente.</p>
          </div>
        `;
            }

            // Enfocar el primer campo inválido
            if (!okNombre && nombreInput) nombreInput.focus();
            else if (!okCorreo && correoInput) correoInput.focus();
            else if (!okFecha && fechaInput) fechaInput.focus();
            else if (!okCelular && celularInput) celularInput.focus();
            else if (!okCarrera && carreraSelect) carreraSelect.focus();
            else if (!okSemestre && semestreInput) semestreInput.focus();
            else if (!okMensaje && mensajeInput) mensajeInput.focus();

            return;
        }

        // Si todo es válido (Guía Oficial PWA con jQuery slideDown + delay + slideUp)
        if (window.jQuery) {
            $('#successAlert').slideDown().delay(3500).slideUp();
        }

        const nombreVal = nombreInput.value.trim();
        const correoVal = correoInput ? correoInput.value.trim() : '';
        const fechaVal = fechaInput.value;
        const celularVal = celularInput.value.trim();
        const carreraVal = carreraSelect.value;
        const semestreNum = semestreInput.value.trim();
        const mensajeVal = mensajeInput ? mensajeInput.value.trim() : '';

        const mensajeWa = encodeURIComponent(
            `¡Hola Gabriel! Me he registrado en tu portafolio PWA:\n\n• Estudiante: ${nombreVal}\n• Correo: ${correoVal}\n• Carrera: ${carreraVal}\n• Semestre: ${semestreNum}º\n• Celular: ${celularVal}\n• Fecha: ${fechaVal}\n• Mensaje: ${mensajeVal}\n\n¡Un gusto contactarte!`
        );

        if (alertaBox) {
            alertaBox.innerHTML = `
        <div class="alert alert-success border-0 shadow-lg p-4" role="alert">
          <h5 class="alert-heading fw-bold text-success mb-2">
            <i class="bi bi-patch-check-fill me-2 fs-4"></i>¡Registro Académico y Mensaje PWA Validados Exitosamente!
          </h5>
          <p class="mb-2">Todos los campos han cumplido rigurosamente las reglas de validación del DOM y jQuery en tiempo real.</p>
          <hr class="my-3">
          <div class="p-3 rounded bg-dark bg-opacity-10 mb-3 small">
            <div><strong>Estudiante / Visitante:</strong> ${nombreVal}</div>
            <div><strong>Correo Electrónico:</strong> ${correoVal}</div>
            <div><strong>Carrera Universitaria:</strong> ${carreraVal}</div>
            <div><strong>Semestre Actual:</strong> ${semestreNum}º Semestre</div>
            <div><strong>Contacto Bolivia:</strong> +591 ${celularVal}</div>
            <div><strong>Fecha Registrada:</strong> ${fechaVal}</div>
            <div><strong>Mensaje / Requerimiento:</strong> ${mensajeVal}</div>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <a href="https://wa.me/59160120550?text=${mensajeWa}" target="_blank" rel="noopener noreferrer" class="btn btn-success fw-semibold">
              <i class="bi bi-whatsapp me-2"></i>Enviar confirmación a mi WhatsApp (+591 60120550)
            </a>
            <button type="button" class="btn btn-outline-secondary btn-sm" id="btnLimpiarForm">
              <i class="bi bi-arrow-repeat me-1"></i>Nuevo Registro
            </button>
          </div>
        </div>
      `;

            const btnLimpiar = document.getElementById('btnLimpiarForm');
            if (btnLimpiar) {
                btnLimpiar.addEventListener('click', () => {
                    form.reset();
                    if (window.jQuery) {
                        $('#errNombre, #errCorreo, #errMensaje').hide();
                        $('#successAlert').stop(true, true).hide();
                    }
                    [nombreInput, correoInput, fechaInput, celularInput, carreraSelect, semestreInput, mensajeInput].forEach(el => {
                        if (el) el.classList.remove('input-valido', 'input-invalido', 'is-valid', 'is-invalid');
                    });
                    ['err-nombre', 'err-correo', 'err-fecha', 'err-celular', 'err-carrera', 'err-semestre', 'err-mensaje',
                        'val-nombre', 'val-correo', 'val-fecha', 'val-celular', 'val-carrera', 'val-semestre', 'val-mensaje'].forEach(id => {
                            const el = document.getElementById(id);
                            if (el) el.innerHTML = '';
                        });
                    alertaBox.innerHTML = '';
                });
            }
        }
    });
}
window.inicializarFormularioContacto = inicializarFormularioContacto;