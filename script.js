
(() => {
    "use strict";

    // ==========================================
    // SISTEMA SOLAR 3D PARA SHIRLEY ❤️
    // ==========================================

    const contenedor = document.getElementById("sistemaSolar3D");
    const tituloMensaje = document.getElementById("tituloMensaje");
    const textoMensaje = document.getElementById("textoMensaje");
    const panelMensaje = document.getElementById("panelMensaje");
    const cerrarMensaje = document.getElementById("cerrarMensaje");

    const planetas = [
        {
            nombre: "Mercurio",
            color: 0xb8b5b2,
            tamano: 0.38,
            orbita: 3.2,
            velocidad: 0.85,
            mensaje: "Aunque seas pequeña como este planeta, tu forma de ser puede llenar de luz un universo entero. ❤️"
        },
        {
            nombre: "Venus",
            color: 0xffbd52,
            tamano: 0.58,
            orbita: 4.5,
            velocidad: 0.65,
            mensaje: "Eres como Venus: tienes un brillo especial que hace difícil no quedarse mirándote. ✨"
        },
        {
            nombre: "Tierra",
            color: 0x168bff,
            tamano: 0.65,
            orbita: 5.9,
            velocidad: 0.48,
            mensaje: "Entre tantos lugares del universo, qué bonito que nuestros caminos se hayan encontrado. 🌎❤️"
        },
        {
            nombre: "Marte",
            color: 0xff382c,
            tamano: 0.49,
            orbita: 7.4,
            velocidad: 0.38,
            mensaje: "Ni la distancia más grande puede impedir que alguien ocupe un lugar especial en tus pensamientos. 🔴"
        },
        {
            nombre: "Júpiter",
            color: 0xffbd80,
            tamano: 1.12,
            orbita: 9.3,
            velocidad: 0.25,
            mensaje: "Hay personas que se vuelven enormes en tu vida sin necesidad de hacer ruido. Tú eres una de ellas. 🪐"
        },
        {
            nombre: "Saturno",
            color: 0xffd778,
            tamano: 0.91,
            orbita: 11.5,
            velocidad: 0.19,
            mensaje: "Si pudiera regalarte algo tan infinito como estos anillos, sería un montón de motivos para sonreír. 💍"
        },
        {
            nombre: "Urano",
            color: 0x5cf2ff,
            tamano: 0.72,
            orbita: 13.5,
            velocidad: 0.14,
            mensaje: "Eres diferente de una manera bonita. No necesitas parecerte a nadie para ser especial. 💙"
        },
        {
            nombre: "Neptuno",
            color: 0x285cff,
            tamano: 0.70,
            orbita: 15.5,
            velocidad: 0.11,
            mensaje: "Y si el universo no tuviera fin, todavía encontraría espacio para recordarte lo mucho que vales. 🌌❤️"
        }
    ];

    // Guardar los mensajes originales de tu página.
    const mensajesOriginales = {};

    document.querySelectorAll(
        ".planeta-en-orbita[data-mensaje], .boton-mensaje[data-mensaje]"
    ).forEach((boton) => {
        const nombre = (
            boton.dataset.titulo || boton.textContent || ""
        ).trim().toLowerCase();

        if (nombre) {
            mensajesOriginales[nombre] = {
                titulo: boton.dataset.titulo || boton.textContent.trim(),
                mensaje: boton.dataset.mensaje
            };
        }
    });

    // Mostrar los mensajes en el panel existente.
    function mostrarMensaje(nombre, mensaje) {
        if (tituloMensaje) {
            tituloMensaje.textContent = nombre;
        }

        if (textoMensaje) {
            textoMensaje.textContent = mensaje;
        }

        if (panelMensaje) {
            panelMensaje.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }

    // Mantener funcionales los botones del catálogo.
    document.querySelectorAll(
        ".planeta-en-orbita[data-mensaje], .boton-mensaje[data-mensaje]"
    ).forEach((boton) => {
        boton.addEventListener("click", () => {
            mostrarMensaje(
                boton.dataset.titulo || boton.textContent.trim(),
                boton.dataset.mensaje
            );
        });
    });

    // Restablecer el panel.
    if (cerrarMensaje) {
        cerrarMensaje.addEventListener("click", () => {
            if (tituloMensaje) {
                tituloMensaje.textContent = "Tu pequeño rincón";
            }

            if (textoMensaje) {
                textoMensaje.textContent =
                    "Elige un planeta y descubre las palabras que preparé especialmente para ti.";
            }

            const sistema = document.getElementById("sistema");

            if (sistema) {
                sistema.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }

    // Comprobar que Three.js esté disponible.
    if (!contenedor || !window.THREE) {
        console.error(
            "No se encontró Three.js o el elemento sistemaSolar3D. Comprueba la conexión a internet y el HTML."
        );
        return;
    }

    const THREE = window.THREE;

    // ==========================================
    // ESCENA Y CÁMARA
    // ==========================================

    const escena = new THREE.Scene();
    escena.background = new THREE.Color(0x030616);

    const camara = new THREE.PerspectiveCamera(
        45,
        1,
        0.1,
        150
    );

    camara.position.set(0, 30, 43);
    camara.lookAt(0, 0, 0);

    let renderizador;

    try {
        renderizador = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });
    } catch (error) {
        console.error("No se pudo iniciar WebGL:", error);
        return;
    }

    renderizador.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
    );

    renderizador.outputEncoding = THREE.sRGBEncoding;

    renderizador.setSize(
        contenedor.clientWidth || 500,
        contenedor.clientHeight || 500
    );

    renderizador.domElement.setAttribute(
        "aria-label",
        "Sistema solar 3D interactivo. Toca un planeta para leer su mensaje."
    );

    renderizador.domElement.style.display = "block";
    renderizador.domElement.style.width = "100%";
    renderizador.domElement.style.height = "100%";

    contenedor.appendChild(renderizador.domElement);

    // ==========================================
    // ILUMINACIÓN MÁS INTENSA
    // ==========================================

    escena.add(
        new THREE.AmbientLight(0xffffff, 1.8)
    );

    const luzSolar = new THREE.PointLight(
        0xffffff,
        4.5,
        120
    );

    luzSolar.position.set(0, 0, 0);
    escena.add(luzSolar);

    // Luz azul suave para destacar los bordes.
    const luzAzul = new THREE.PointLight(
        0x4d79ff,
        1.8,
        75
    );

    luzAzul.position.set(-12, 10, -10);
    escena.add(luzAzul);

    // ==========================================
    // SOL BRILLANTE CON HALO
    // ==========================================

    const sol = new THREE.Mesh(
        new THREE.SphereGeometry(1.65, 48, 48),
        new THREE.MeshBasicMaterial({
            color: 0xffc12e
        })
    );

    escena.add(sol);

    const haloSol = new THREE.Mesh(
        new THREE.SphereGeometry(2.05, 40, 40),
        new THREE.MeshBasicMaterial({
            color: 0xff762b,
            transparent: true,
            opacity: 0.23,
            side: THREE.BackSide,
            depthWrite: false
        })
    );

    escena.add(haloSol);

    // Resplandor exterior.
    const resplandor = new THREE.Mesh(
        new THREE.SphereGeometry(2.65, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xff9d27,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide,
            depthWrite: false
        })
    );

    escena.add(resplandor);

    // ==========================================
    // ESTRELLAS
    // ==========================================

    const posicionesEstrellas = [];

    for (let i = 0; i < 1600; i++) {
        const x = (Math.random() - 0.5) * 90;
        const y = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 90;

        if (Math.sqrt(x * x + z * z) > 3) {
            posicionesEstrellas.push(x, y, z);
        }
    }

    const geometriaEstrellas = new THREE.BufferGeometry();

    geometriaEstrellas.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            posicionesEstrellas,
            3
        )
    );

    const estrellas = new THREE.Points(
        geometriaEstrellas,
        new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.085,
            transparent: true,
            opacity: 0.95,
            sizeAttenuation: true
        })
    );

    escena.add(estrellas);

    // ==========================================
    // CREACIÓN DE ÓRBITAS Y PLANETAS
    // ==========================================

    const objetosSeleccionables = [];
    const gruposPlanetas = [];

    planetas.forEach((datos, indice) => {
        // Dibujar la órbita.
        const geometriaOrbita = new THREE.BufferGeometry();
        const puntosOrbita = [];

        for (let i = 0; i <= 180; i++) {
            const angulo = (i / 180) * Math.PI * 2;

            puntosOrbita.push(
                Math.cos(angulo) * datos.orbita,
                0,
                Math.sin(angulo) * datos.orbita
            );
        }

        geometriaOrbita.setFromPoints(puntosOrbita);

        const lineaOrbita = new THREE.LineLoop(
            geometriaOrbita,
            new THREE.LineBasicMaterial({
                color: 0x91aaff,
                transparent: true,
                opacity: 0.4
            })
        );

        escena.add(lineaOrbita);

        // Grupo orbital.
        const grupo = new THREE.Group();
        escena.add(grupo);

        // Material con color intenso y luz propia.
        const material = new THREE.MeshPhongMaterial({
            color: datos.color,
            emissive: datos.color,
            emissiveIntensity: 0.18,
            shininess: 45,
            specular: new THREE.Color(0x888888)
        });

        const esfera = new THREE.Mesh(
            new THREE.SphereGeometry(
                datos.tamano,
                48,
                36
            ),
            material
        );

        esfera.userData.nombrePlaneta = datos.nombre;
        esfera.userData.indicePlaneta = indice;

        grupo.add(esfera);
        objetosSeleccionables.push(esfera);

        // Bandas decorativas de Júpiter.
        if (datos.nombre === "Júpiter") {
            const bandas = [
                { y: -0.48, escala: 0.91, color: 0x9c5f40 },
                { y: -0.17, escala: 0.97, color: 0xffe0b2 },
                { y: 0.18, escala: 0.96, color: 0xb8754c },
                { y: 0.48, escala: 0.86, color: 0xffd7a0 }
            ];

            bandas.forEach((banda) => {
                const franja = new THREE.Mesh(
                    new THREE.TorusGeometry(
                        datos.tamano * banda.escala,
                        datos.tamano * 0.045,
                        6,
                        64
                    ),
                    new THREE.MeshBasicMaterial({
                        color: banda.color,
                        transparent: true,
                        opacity: 0.8
                    })
                );

                franja.position.y = banda.y * datos.tamano;
                franja.rotation.x = Math.PI / 2;
                esfera.add(franja);
            });
        }

        // Anillos de Saturno.
        if (datos.nombre === "Saturno") {
            const anillo = new THREE.Mesh(
                new THREE.RingGeometry(
                    datos.tamano * 1.25,
                    datos.tamano * 2.0,
                    96
                ),
                new THREE.MeshBasicMaterial({
                    color: 0xffdca0,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.95
                })
            );

            anillo.rotation.x = -Math.PI / 2.35;
            anillo.rotation.y = 0.12;
            esfera.add(anillo);

            const anilloInterior = new THREE.Mesh(
                new THREE.RingGeometry(
                    datos.tamano * 1.05,
                    datos.tamano * 1.28,
                    96
                ),
                new THREE.MeshBasicMaterial({
                    color: 0xc49b66,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.9
                })
            );

            anilloInterior.rotation.copy(anillo.rotation);
            esfera.add(anilloInterior);
        }

        // Inclinación de Urano.
        if (datos.nombre === "Urano") {
            esfera.rotation.z = Math.PI / 2.2;
        }

        gruposPlanetas.push({
            grupo,
            esfera,
            datos,
            anguloInicial: indice * 0.75
        });
    });

    // ==========================================
    // SELECCIÓN TÁCTIL DE LOS PLANETAS
    // ==========================================

    const raycaster = new THREE.Raycaster();
    const posicionPuntero = new THREE.Vector2();

    renderizador.domElement.addEventListener(
        "pointerdown",
        (evento) => {
            const rectangulo =
                renderizador.domElement.getBoundingClientRect();

            posicionPuntero.x =
                ((evento.clientX - rectangulo.left) /
                    rectangulo.width) * 2 - 1;

            posicionPuntero.y =
                -((evento.clientY - rectangulo.top) /
                    rectangulo.height) * 2 + 1;

            raycaster.setFromCamera(
                posicionPuntero,
                camara
            );

            const impactos = raycaster.intersectObjects(
                objetosSeleccionables,
                false
            );

            if (impactos.length === 0) {
                return;
            }

            const esferaElegida = impactos[0].object;
            const nombre = esferaElegida.userData.nombrePlaneta;
            const clave = nombre.toLowerCase();

            const mensajeGuardado = mensajesOriginales[clave];

            const planetaOriginal = planetas.find(
                (p) => p.nombre === nombre
            );

            mostrarMensaje(
                mensajeGuardado
                    ? mensajeGuardado.titulo
                    : nombre,
                mensajeGuardado
                    ? mensajeGuardado.mensaje
                    : planetaOriginal.mensaje
            );

            // Efecto de selección.
            esferaElegida.scale.setScalar(1.18);

            window.setTimeout(() => {
                esferaElegida.scale.setScalar(1);
            }, 220);
        }
    );

    // ==========================================
    // ANIMACIÓN DEL SISTEMA SOLAR
    // ==========================================

    const reloj = new THREE.Clock();

    function animar() {
        requestAnimationFrame(animar);

        const tiempo = reloj.getElapsedTime();

        sol.rotation.y = tiempo * 0.12;
        haloSol.rotation.y = -tiempo * 0.04;
        resplandor.rotation.y = tiempo * 0.025;

        gruposPlanetas.forEach((item) => {
            const angulo =
                item.anguloInicial +
                tiempo * item.datos.velocidad * 0.16;

            item.grupo.position.x =
                Math.cos(angulo) * item.datos.orbita;

            item.grupo.position.z =
                Math.sin(angulo) * item.datos.orbita;

            item.esfera.rotation.y += 0.008;
        });

        estrellas.rotation.y = tiempo * 0.003;

        renderizador.render(escena, camara);
    }

    // ==========================================
    // AJUSTE PARA CELULARES Y OTRAS PANTALLAS
    // ==========================================

    function ajustarPantalla() {
        const ancho = contenedor.clientWidth || 400;
        const alto = contenedor.clientHeight || ancho;

        camara.aspect = ancho / alto;
        camara.updateProjectionMatrix();

        renderizador.setSize(ancho, alto);
    }

    window.addEventListener("resize", ajustarPantalla);

    ajustarPantalla();
    animar();

})();
