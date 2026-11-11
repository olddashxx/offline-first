/**
 * ===================================================================
 * PORTAFOLIO MÓVIL & TABLET PWA - GABRIEL GARAY (TEC. GABRIEL)
 * Interacciones dinámicas del DOM, Modales, Formulario y PWA
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ===============================================================
       1. MODO OSCURO / MODO CLARO CON PERSISTENCIA
       =============================================================== */
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function aplicarTema(claro) {
        document.body.classList.toggle('light-mode', claro);
        document.body.classList.toggle('dark-mode', !claro);
        if (themeIcon) {
            themeIcon.className = claro ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        }
        if (themeMeta) {
            themeMeta.setAttribute('content', claro ? '#f0f9ff' : '#0b0f19');
        }
    }

    try {
        aplicarTema(localStorage.getItem('gabriel_mobile_theme') === 'light');
    } catch (e) {
        aplicarTema(false);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const esClaro = !document.body.classList.contains('light-mode');
            aplicarTema(esClaro);
            try {
                localStorage.setItem('gabriel_mobile_theme', esClaro ? 'light' : 'dark');
            } catch (e) {}
        });
    }

    /* ===============================================================
       2. PANEL LATERAL DE REDES ("LISTA DE AMIGOS / CONTACTO")
       =============================================================== */
    const friendsPanel = document.getElementById('friends-panel');
    const panelToggle = document.getElementById('panel-toggle');
    const btnRedes = document.getElementById('btn-redes');
    const pantallaAmplia = window.matchMedia('(min-width: 821px) and (orientation: landscape)');

    function setPanel(abierto) {
        if (!friendsPanel) return;
        friendsPanel.classList.toggle('collapsed', !abierto);
        if (panelToggle) panelToggle.setAttribute('aria-expanded', String(abierto));
        if (btnRedes) btnRedes.classList.toggle('active', abierto && !pantallaAmplia.matches);
    }

    const alternarPanel = () => setPanel(friendsPanel.classList.contains('collapsed'));

    if (friendsPanel) {
        // En tablets horizontales inicia abierto, en celulares cerrado
        setPanel(pantallaAmplia.matches);
        if (panelToggle) panelToggle.addEventListener('click', alternarPanel);
        if (btnRedes) btnRedes.addEventListener('click', (e) => {
            e.stopPropagation();
            alternarPanel();
        });

        // Tocar fuera del panel en teléfonos lo cierra
        document.addEventListener('click', (e) => {
            if (pantallaAmplia.matches) return;
            if (!friendsPanel.classList.contains('collapsed') && !friendsPanel.contains(e.target)) {
                setPanel(false);
            }
        });
    }

    // Resalta pestañas activas mientras los modales correspondientes están abiertos
    const botonesDeModal = (id) => document.querySelectorAll(`.lobby-icon-btn[data-bs-target="#${id}"], .nav-tab[data-bs-target="#${id}"]`);
    document.addEventListener('show.bs.modal', (e) => botonesDeModal(e.target.id).forEach(b => b.classList.add('active')));
    document.addEventListener('hidden.bs.modal', (e) => botonesDeModal(e.target.id).forEach(b => b.classList.remove('active')));

    /* ===============================================================
       3. FILTRADO DE VIDEOJUEGOS POR CATEGORÍA
       =============================================================== */
    const gameFilterButtons = document.querySelectorAll('.game-filter-btn');
    const gameCards = document.querySelectorAll('.game-card');
    const noGamesMsg = document.getElementById('no-games-found');

    gameFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            gameFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedFilter = button.getAttribute('data-filter');
            let visibleCount = 0;

            gameCards.forEach(card => {
                const visible = selectedFilter === 'todos' || card.dataset.categoria === selectedFilter;
                card.style.display = visible ? 'block' : 'none';
                if (visible) visibleCount++;
            });

            if (noGamesMsg) noGamesMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
        });
    });

    /* ===============================================================
       4. SECCIÓN MÚSICA: CATÁLOGO DE GABRIEL Y TOP CANCIONES
       =============================================================== */
    const catalogoMusicaGabriel = {
        "cuco": {
            nombre: "Cuco",
            genero: "Indie Pop & Dream Pop",
            descripcion: "Sintetizadores nostálgicos, trompetas suaves y atmósferas envolventes para programar y relajarse.",
            canciones: [
                { rank: 1, titulo: "Hydrocodone", album: "Para Mi (2019)", tipo: "Dream Pop Nostálgico" },
                { rank: 2, titulo: "Lover Is a Day", album: "Songs4u (2017)", tipo: "Clásico Indie" },
                { rank: 3, titulo: "Bossa No Sé (feat. Jean Carter)", album: "Para Mi (2019)", tipo: "Bossa Nova Pop" },
                { rank: 4, titulo: "Amor de Siempre", album: "Wannabewithu (2016)", tipo: "Balada Romántica" },
                { rank: 5, titulo: "Under the Sun", album: "Fantasy Gateway (2022)", tipo: "Synthwave / Chill" }
            ]
        },
        "gym-phonk": {
            nombre: "Phonk & Gym Workout",
            genero: "High Energy & Fuerza",
            descripcion: "Bajos distorsionados y ritmos de alta intensidad para entrenar pesado los 6 días de gimnasio.",
            canciones: [
                { rank: 1, titulo: "Murder In My Mind", album: "Kordhell (2022)", tipo: "Drift Phonk" },
                { rank: 2, titulo: "Sahara", album: "Hensonn (2021)", tipo: "Gym Motivation" },
                { rank: 3, titulo: "Close Eyes", album: "DVRST (2021)", tipo: "Cyber Phonk" },
                { rank: 4, titulo: "Metamorphosis", album: "INTERWORLD (2021)", tipo: "Power Workout" },
                { rank: 5, titulo: "Brazilian Dança Phonk", album: "Phonk Nation (2023)", tipo: "Heavy Beat" }
            ]
        },
        "soda-stereo": {
            nombre: "Soda Stereo & Cerati",
            genero: "Rock en Español & New Wave",
            descripcion: "Elegancia musical, guitarras atemporales e himnos del rock latinoamericano de cabecera.",
            canciones: [
                { rank: 1, titulo: "De Música Ligera", album: "Canción Animal (1990)", tipo: "Himno del Rock" },
                { rank: 2, titulo: "Trátame Suavemente", album: "Soda Stereo (1984)", tipo: "Balada Clásica" },
                { rank: 3, titulo: "Crimen (Gustavo Cerati)", album: "Ahí Vamos (2006)", tipo: "Rock Poético" },
                { rank: 4, titulo: "En la Ciudad de la Furia", album: "Doble Vida (1988)", tipo: "Post-Punk / Rock" },
                { rank: 5, titulo: "Persiana Americana", album: "Signos (1986)", tipo: "Pop Rock 80s" }
            ]
        },
        "romantica": {
            nombre: "Baladas Románticas Clásicas",
            genero: "Balada Oro & Bolero Pop",
            descripcion: "Voces icónicas de la balada en español (Chayanne, Ricardo Arjona, José José).",
            canciones: [
                { rank: 1, titulo: "Torero", album: "Grandes Éxitos - Chayanne (2002)", tipo: "Energía Latina" },
                { rank: 2, titulo: "Historia de Taxi", album: "Historias - Ricardo Arjona (1994)", tipo: "Narrativa Acústica" },
                { rank: 3, titulo: "Dejaría Todo", album: "Atado a Tu Amor - Chayanne (1998)", tipo: "Balada Clásica" },
                { rank: 4, titulo: "El Triste", album: "José José (1970)", tipo: "Balada Inmortal" },
                { rank: 5, titulo: "Señora de las Cuatro Décadas", album: "Ricardo Arjona (1994)", tipo: "Clásico Romántico" }
            ]
        }
    };

    const selectGeneroMobile = document.getElementById('select-genero-mobile');
    const containerListaMusica = document.getElementById('lista-canciones-mobile');
    const infoGeneroMobile = document.getElementById('info-genero-mobile');

    function renderizarMusica(clave) {
        if (!containerListaMusica || !catalogoMusicaGabriel[clave]) return;
        const item = catalogoMusicaGabriel[clave];

        if (infoGeneroMobile) {
            infoGeneroMobile.innerHTML = `
                <div class="p-2 mb-3 rounded" style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3);">
                    <h6 class="m-0 fw-bold text-cyan"><i class="fa-solid fa-compact-disc me-2"></i>${item.nombre} - ${item.genero}</h6>
                    <small class="text-muted">${item.descripcion}</small>
                </div>
            `;
        }

        containerListaMusica.innerHTML = item.canciones.map(c => `
            <div class="music-item-row">
                <span class="music-rank-badge">${c.rank}</span>
                <div class="flex-grow-1 min-w-0">
                    <strong class="d-block text-truncate" style="font-size: 0.9rem;">${c.titulo}</strong>
                    <small class="text-muted d-block text-truncate">${c.album}</small>
                </div>
                <span class="badge bg-dark border text-info" style="font-size: 0.72rem;">${c.tipo}</span>
            </div>
        `).join('');
    }

    if (selectGeneroMobile) {
        renderizarMusica('cuco');
        selectGeneroMobile.addEventListener('change', (e) => {
            renderizarMusica(e.target.value);
        });
    }

    /* ===============================================================
       5. FORMULARIO DE CONTACTO CON ENVÍO DIRECTO A WHATSAPP
       =============================================================== */
    const contactForm = document.getElementById('contact-form-mobile');
    const formAlertBox = document.getElementById('form-alert-container-mobile');
    const campoMensaje = document.getElementById('campo-mensaje');
    const contadorMensaje = document.getElementById('contador-mensaje');

    if (campoMensaje && contadorMensaje) {
        campoMensaje.addEventListener('input', () => {
            contadorMensaje.textContent = `${campoMensaje.value.length}/500`;
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Trampa anti-bots (honeypot)
            const honeypot = document.getElementById('campo-web');
            if (honeypot && honeypot.value.trim() !== '') {
                console.warn('Bot detectado');
                return;
            }

            const nombre = document.getElementById('campo-nombre').value.trim();
            const correo = document.getElementById('campo-correo').value.trim();
            const telefono = document.getElementById('campo-telefono').value.trim();
            const motivo = document.getElementById('campo-motivo').value;
            const mensaje = document.getElementById('campo-mensaje').value.trim();
            const terminos = document.getElementById('campo-terminos').checked;

            if (!nombre || !correo || !telefono || !motivo || !mensaje || !terminos) {
                if (formAlertBox) {
                    formAlertBox.innerHTML = `
                        <div class="alert alert-danger p-2 mb-3 small" role="alert">
                            <i class="fa-solid fa-triangle-exclamation me-1"></i> Por favor completa todos los campos obligatorios (*) y acepta los términos.
                        </div>
                    `;
                }
                return;
            }

            const btnEnviar = document.getElementById('btn-enviar');
            if (btnEnviar) {
                btnEnviar.disabled = true;
                btnEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Generando mensaje...';
            }

            const mensajeWhatsApp = encodeURIComponent(
                `¡Hola Gabriel! Te contacto desde tu Portafolio PWA Móvil:\n\n` +
                `• Nombre: ${nombre}\n` +
                `• Correo: ${correo}\n` +
                `• Teléfono/WhatsApp: ${telefono}\n` +
                `• Motivo: ${motivo}\n` +
                `• Mensaje: ${mensaje}\n\n` +
                `¡Saludos desde el móvil!`
            );

            const enlaceWa = `https://wa.me/59160120550?text=${mensajeWhatsApp}`;

            setTimeout(() => {
                if (formAlertBox) {
                    formAlertBox.innerHTML = `
                        <div class="alert alert-success p-3 mb-3 small" role="alert">
                            <h6 class="fw-bold mb-1"><i class="fa-solid fa-circle-check me-1"></i>¡Datos validados con éxito!</h6>
                            <p class="mb-2">Haz clic abajo para abrir WhatsApp y enviar tu mensaje a Gabriel (+591 60120550):</p>
                            <a href="${enlaceWa}" target="_blank" rel="noopener noreferrer" class="btn btn-success btn-sm fw-bold">
                                <i class="fa-brands fa-whatsapp me-1"></i>Abrir en WhatsApp
                            </a>
                        </div>
                    `;
                }
                if (btnEnviar) {
                    btnEnviar.disabled = false;
                    btnEnviar.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>Enviar Mensaje';
                }
            }, 500);
        });
    }

    /* ===============================================================
       6. PWA: SERVICE WORKER & BOTÓN DE INSTALACIÓN
       =============================================================== */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('[PWA Móvil] SW Registrado:', reg.scope))
                .catch(err => console.log('[PWA Móvil] Error SW:', err));
        });
    }

    let deferredPrompt = null;
    const installBtn = document.getElementById('pwa-install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) installBtn.style.display = 'inline-flex';
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
            installBtn.style.display = 'none';
        });
    }

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        if (installBtn) installBtn.style.display = 'none';
    });

});

/* ===============================================================
   7. HIDRATACIÓN CON JQUERY + TOASTS + BOTÓN REFRESCAR PWA
   =============================================================== */
$(document).ready(function() {
    let toastTimer = null;
    let refreshTimer = null;

    function mostrarToast(texto, ms) {
        let $t = $('#toast-hidratacion');
        if (!$t.length) {
            $t = $('<div id="toast-hidratacion" class="toast-hidratacion" role="status" aria-live="polite"></div>').appendTo('body');
        }
        $t.text(texto);
        void $t[0].offsetWidth; // reiniciar transición
        $t.addClass('visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            $t.removeClass('visible');
        }, ms || 2200);
    }

    function leerSesion(clave) { try { return sessionStorage.getItem(clave); } catch (e) { return null; } }
    function guardarSesion(clave, valor) { try { sessionStorage.setItem(clave, valor); } catch (e) {} }

    // Click en botón refrescar con giro y contador
    function alHacerRefresh(e) {
        e.preventDefault();
        const $btn = $('#btnRefrescar');
        if ($btn.hasClass('refrescando')) return;

        const n = (parseInt(leerSesion('contadorRefrescosM'), 10) || 0) + 1;
        guardarSesion('contadorRefrescosM', String(n));
        guardarSesion('refrescoPendienteM', '1');

        $btn.addClass('refrescando').attr('aria-busy', 'true');
        mostrarToast('🔄 Refrescando app móvil… (#' + n + ')', 1500);

        refreshTimer = setTimeout(function () {
            location.reload();
        }, 800);
    }

    // Proceso de hidratación de interfaz
    function hidratarInterfaz() {
        const $box = $('#contenedorMenu');
        if ($box.attr('data-hidratado') === 'true') return;

        $(document).off('click.hidratacion', '#btnRefrescar');
        $(document).on('click.hidratacion', '#btnRefrescar', alHacerRefresh);

        $('#btnRefrescar').attr({ 'aria-label': 'Refrescar app', title: 'Refrescar app' });

        // Aviso dinámico al hacer click en botones hidratados
        let totalClicks = 0;
        $(document).off('click.avisoBoton', 'button');
        $(document).on('click.avisoBoton', 'button', function () {
            if (this.id === 'btnRefrescar') return;
            if (this.getAttribute('data-hidratado') !== 'true') return;
            totalClicks++;
            mostrarToast('✅ Acción móvil activada (#' + totalClicks + ')', 1400);
        });

        // Activar todos los botones
        $('button[data-hidratado="false"]').attr('data-hidratado', 'true');
        $box.attr('data-hidratado', 'true');
        $('body').attr('data-hidratado', 'true');

        if (leerSesion('refrescoPendienteM') === '1') {
            guardarSesion('refrescoPendienteM', '0');
            mostrarToast('✅ App refrescada exitosamente (#' + (leerSesion('contadorRefrescosM') || 1) + ')', 2400);
        } else {
            mostrarToast('✅ Interfaz móvil PWA hidratada', 1800);
        }
    }

    // Hidratación del Service Worker y Conectividad
    function hidratarPWA() {
        if ($('body').attr('data-pwa') === 'true') return;
        $('body').attr('data-pwa', 'true');

        const modoApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        $('body').attr('data-modo', modoApp ? 'app-instalada' : 'navegador');

        $(window).off('online.pwa offline.pwa')
            .on('online.pwa', function () { mostrarToast('📶 Conexión restablecida (En línea)', 2000); })
            .on('offline.pwa', function () { mostrarToast('📴 Sin conexión (Modo PWA Offline)', 2500); });

        if (!('serviceWorker' in navigator)) return;

        navigator.serviceWorker.addEventListener('message', function (ev) {
            if (ev.data && ev.data.type === 'SW_VERSION') {
                $('body').attr('data-sw', ev.data.cache);
                mostrarToast('📲 PWA Activa · ' + ev.data.cache, 2500);
            }
        });

        navigator.serviceWorker.ready.then(function (reg) {
            if (reg.active) reg.active.postMessage('GET_VERSION');
        });
    }

    setTimeout(hidratarInterfaz, 500);
    setTimeout(hidratarPWA, 900);

    $(window).off('pagehide.hidratacion').on('pagehide.hidratacion', function () {
        clearTimeout(toastTimer);
        clearTimeout(refreshTimer);
    });
});

