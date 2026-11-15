// IMPORTACIÓN DE MÓDULOS
// (sin módulos en este ejercicio)

// MAPEO DEL DOM
const dom = {
  gallery: document.getElementById("gallery"),           // Contenedor donde se muestran las fotos
  status: document.getElementById("status"),             // Mensajes: cargando, error o sin resultados
  searchForm: document.getElementById("search-form"),     // Formulario del buscador
  searchInput: document.getElementById("search-input"),   // Campo de texto para escribir el tema
  loadMoreBtn: document.getElementById("load-more"),      // Botón para pedir más fotos
  themeToggle: document.getElementById("theme-toggle"),   // Botón día / noche
  root: document.documentElement,                         // Etiqueta <html>; aquí se activa el tema oscuro
};

// DECLARACIÓN DE VARIABLES
const ACCESS_KEY = "-AdzF6AE-wL5Cp1Gva-uSlYx_vPn7dWldXhKu3WP3Q8"; // Clave de acceso a la API de Unsplash
const PER_PAGE = 12;                                      // Cuántas fotos se piden por cada petición
const DEFAULT_QUERY = "nature";                           // Tema inicial si el buscador está vacío
const THEME_KEY = "theme";                                // Nombre de la clave guardada en localStorage

let currentQuery = DEFAULT_QUERY;                         // Tema de búsqueda actual
let currentPage = 1;                                      // Página actual para la paginación

// DECLARACIÓN DE FUNCIONES

const construirUrlApi = (query, page) => {                 // Arma la URL con todos los parámetros de la API
  const url = new URL("https://api.unsplash.com/search/photos"); // Endpoint de búsqueda de Unsplash
  url.searchParams.set("query", query);                   // Tema a buscar: playa, viajes, etc.
  url.searchParams.set("page", String(page));             // Número de página para "Cargar más"
  url.searchParams.set("per_page", String(PER_PAGE));     // Cantidad de fotos por página
  url.searchParams.set("client_id", ACCESS_KEY);          // Identificador de tu aplicación en Unsplash
  return url;                                             // Devuelve la URL lista para fetch
};

const obtenerFotos = async (query, page) => {             // Pide fotos a Unsplash de forma asíncrona
  const response = await fetch(construirUrlApi(query, page)); // Hace la petición HTTP a la API
  let data;                                               // Variable donde se guardará la respuesta

  if (response.ok) {                                      // Si la respuesta es correcta (código 200)
    data = await response.json();                         // Convierte el JSON en un objeto JavaScript
  } else {                                                // Si hay error (key incorrecta, límite, etc.)
    throw new Error("No se pudieron cargar las fotos. Revisa tu Access Key.");
  }

  return data;                                            // Devuelve el objeto con el array results
};

const obtenerTextoAlt = (photo) => {                      // Elige el mejor texto alternativo para la imagen
  let texto;                                              // Variable que guardará el texto final

  if (photo.alt_description) {                            // Prioridad 1: descripción corta de Unsplash
    texto = photo.alt_description;
  } else if (photo.description) {                         // Prioridad 2: descripción larga
    texto = photo.description;
  } else {                                                // Prioridad 3: texto genérico si no hay descripción
    texto = "Foto de Unsplash";
  }

  return texto;                                           // Devuelve el texto para el atributo alt
};

const construirHtmlTarjeta = (photo) => {                 // Genera el HTML de una sola tarjeta (sin tocar el DOM)
  const altText = obtenerTextoAlt(photo);                 // Texto accesible de la imagen
  const authorName = photo.user.name;                     // Nombre del fotógrafo
  const authorUrl = `${photo.user.links.html}?utm_source=galeria_fotos&utm_medium=referral`; // Perfil del autor
  const photoPage = `${photo.links.html}?utm_source=galeria_fotos&utm_medium=referral`;     // Página de la foto

  return `
    <article class="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg dark:bg-neutral-800 dark:ring-1 dark:ring-neutral-700 dark:hover:ring-neutral-600">
      <figure>
        <a href="${photoPage}" target="_blank" rel="noopener noreferrer">
          <img
            src="${photo.urls.small}"
            alt="${altText}"
            loading="lazy"
            class="h-48 w-full object-cover"
          >
        </a>
        <figcaption class="p-3 text-sm text-neutral-700 dark:text-neutral-300">
          <a
            href="${authorUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#58008b] hover:underline dark:text-purple-300"
          >
            ${authorName}
          </a>
        </figcaption>
      </figure>
    </article>
  `;
};

const construirHtmlGaleria = (fotos) => {                 // Une el HTML de todas las tarjetas en un solo string
  let htmlAcumulado = "";                                 // String vacío que irá creciendo

  for (const foto of fotos) {                             // Recorre cada foto del array results
    htmlAcumulado = htmlAcumulado + construirHtmlTarjeta(foto); // Concatena el HTML de cada tarjeta
  }

  return htmlAcumulado;                                   // Devuelve el bloque HTML completo
};

const obtenerConsultaBusqueda = (valorInput) => {         // Decide qué tema buscar según lo escrito
  let consulta;                                           // Variable para el tema final

  if (valorInput.trim()) {                                // Si el usuario escribió algo
    consulta = valorInput.trim();                         // Usa ese texto sin espacios extra
  } else {                                                // Si el campo está vacío
    consulta = DEFAULT_QUERY;                             // Usa el tema por defecto (nature)
  }

  return consulta;                                        // Devuelve el tema de búsqueda
};

const debeMostrarCargarMas = (cantidadResultados) => {    // Decide si aún hay más fotos por cargar
  let mostrar;                                            // true = mostrar botón, false = ocultarlo

  if (cantidadResultados < PER_PAGE) {                    // Si llegaron menos de 12, ya no hay más páginas
    mostrar = false;
  } else {                                                // Si llegaron 12, probablemente hay más
    mostrar = true;
  }

  return mostrar;                                         // Devuelve la decisión
};

const obtenerTemaOscuro = () => {                         // Lee si el usuario guardó modo oscuro antes
  let esOscuro;                                           // true = noche, false = día

  if (localStorage.getItem(THEME_KEY) === "dark") {       // Comprueba la preferencia guardada
    esOscuro = true;
  } else {                                                // Si no hay valor o es "light"
    esOscuro = false;
  }

  return esOscuro;                                        // Devuelve el tema guardado
};

const obtenerTemaContrario = (temaOscuroActual) => {      // Invierte el tema actual al pulsar el botón
  let esOscuro;                                           // Tema que se aplicará después del clic

  if (temaOscuroActual) {                                 // Si ahora está en modo oscuro
    esOscuro = false;                                     // Pasará a modo día
  } else {                                                // Si ahora está en modo día
    esOscuro = true;                                      // Pasará a modo noche
  }

  return esOscuro;                                        // Devuelve el nuevo tema
};

const actualizarInterfaz = (estadoUi) => {                // ÚNICA función que modifica el DOM
  if (estadoUi.pintarEstado) {                            // ¿Hay que actualizar mensajes y botones?
    dom.status.textContent = estadoUi.mensajeEstado;      // Muestra: cargando, error o vacío
    dom.loadMoreBtn.hidden = !estadoUi.mostrarCargarMas;  // Oculta o muestra "Cargar más"
    dom.loadMoreBtn.disabled = estadoUi.deshabilitarCargarMas; // Bloquea el botón mientras carga
  } else {                                                // No tocar estado de carga
    // sin cambios en estado de carga
  }

  if (estadoUi.pintarGaleria) {                           // ¿Hay que actualizar las fotos?
    if (estadoUi.limpiarGaleria) {                        // ¿Borrar fotos anteriores?
      dom.gallery.innerHTML = "";                         // Vacía la galería antes de una búsqueda nueva
    } else {                                              // Modo "Cargar más": conservar las fotos actuales
      // conservar fotos actuales
    }

    if (estadoUi.fotos.length === 0) {                    // Si no hay fotos que pintar
      // galería vacía o sin nuevas fotos
    } else {                                              // Si hay fotos nuevas
      const htmlFotos = construirHtmlGaleria(estadoUi.fotos); // Construye el HTML fuera del DOM
      dom.gallery.insertAdjacentHTML("beforeend", htmlFotos); // Inserta las tarjetas al final de la galería
    }
  } else {                                                // No tocar la galería (ej. solo cambio de tema)
    // sin cambios en la galería
  }

  if (estadoUi.pintarTema) {                              // ¿Hay que actualizar día / noche?
    if (estadoUi.esOscuro) {                              // Activar modo oscuro
      dom.root.classList.add("dark");                     // Tailwind aplica estilos dark:*
      dom.themeToggle.textContent = "☀️ Día";             // El botón invita a volver al modo día
      dom.themeToggle.setAttribute("aria-label", "Cambiar a modo día"); // Accesibilidad para lectores de pantalla
    } else {                                              // Activar modo claro
      dom.root.classList.remove("dark");                  // Quita la clase dark del <html>
      dom.themeToggle.textContent = "🌙 Noche";           // El botón invita a activar modo noche
      dom.themeToggle.setAttribute("aria-label", "Cambiar a modo noche");
    }
  } else {                                                // No tocar el tema
    // sin cambios en el tema
  }
};

const cargarFotos = async (opciones) => {                 // Orquesta la petición y luego pinta la interfaz
  let esAppend = false;                                   // false = búsqueda nueva, true = cargar más

  if (opciones && opciones.append) {                      // Si viene desde "Cargar más"
    esAppend = true;                                      // No borrar fotos anteriores
  } else {                                                // Si viene desde buscar o inicio
    esAppend = false;                                     // Reemplazar la galería
  }

  actualizarInterfaz({                                    // Muestra estado de carga
    pintarEstado: true,
    mensajeEstado: "Cargando fotos...",
    mostrarCargarMas: false,
    deshabilitarCargarMas: true,
    pintarGaleria: false,
    pintarTema: false,
  });

  try {                                                   // Intenta obtener datos de la API
    const data = await obtenerFotos(currentQuery, currentPage); // Petición con tema y página actuales
    let mensajeEstado;                                    // Mensaje que verá el usuario
    let mostrarCargarMas;                                 // Si el botón "Cargar más" debe verse

    if (data.results.length === 0) {                      // La API respondió pero sin fotos
      mensajeEstado = "No se encontraron resultados. Prueba con otro tema.";
      mostrarCargarMas = false;
    } else {                                              // Hay fotos para mostrar
      mensajeEstado = "";
      mostrarCargarMas = debeMostrarCargarMas(data.results.length);
    }

    actualizarInterfaz({                                  // Pinta el resultado exitoso
      pintarEstado: true,
      mensajeEstado: mensajeEstado,
      mostrarCargarMas: mostrarCargarMas,
      deshabilitarCargarMas: false,
      pintarGaleria: true,
      fotos: data.results,
      limpiarGaleria: !esAppend,                          // true borra; false añade al final
      pintarTema: false,
    });
  } catch (error) {                                       // Si fetch falla o la key es incorrecta
    actualizarInterfaz({
      pintarEstado: true,
      mensajeEstado: error.message,                       // Muestra el mensaje de error
      mostrarCargarMas: false,
      deshabilitarCargarMas: false,
      pintarGaleria: true,
      fotos: [],
      limpiarGaleria: true,                               // Vacía la galería ante el error
      pintarTema: false,
    });
  }
};

const manejarEnvioBusqueda = (event) => {                 // Se ejecuta al pulsar "Buscar" o Enter
  event.preventDefault();                                 // Evita que la página se recargue
  currentQuery = obtenerConsultaBusqueda(dom.searchInput.value); // Guarda el nuevo tema
  currentPage = 1;                                        // Vuelve a la primera página
  cargarFotos();                                          // Pide y muestra fotos del nuevo tema
};

const manejarCargarMas = () => {                          // Se ejecuta al pulsar "Cargar más"
  currentPage = currentPage + 1;                          // Pasa a la siguiente página
  cargarFotos({ append: true });                          // Añade fotos sin borrar las anteriores
};

const manejarCambioTema = () => {                         // Se ejecuta al pulsar el botón día / noche
  const temaOscuroActual = dom.root.classList.contains("dark"); // Lee el tema actual desde el DOM
  const esOscuro = obtenerTemaContrario(temaOscuroActual); // Calcula el tema opuesto

  if (esOscuro) {                                         // Si pasa a modo oscuro
    localStorage.setItem(THEME_KEY, "dark");              // Guarda la preferencia en el navegador
  } else {                                                // Si pasa a modo claro
    localStorage.setItem(THEME_KEY, "light");
  }

  actualizarInterfaz({                                    // Solo actualiza el tema, no la galería
    pintarEstado: false,
    pintarGaleria: false,
    pintarTema: true,
    esOscuro: esOscuro,
  });
};

const registrarEventos = () => {                          // Conecta botones y formulario con sus funciones
  dom.searchForm.addEventListener("submit", manejarEnvioBusqueda);   // Evento del buscador
  dom.loadMoreBtn.addEventListener("click", manejarCargarMas);       // Evento de cargar más
  dom.themeToggle.addEventListener("click", manejarCambioTema);      // Evento del tema
};

const iniciarAplicacion = () => {                         // Función principal: arranca toda la app
  const esOscuro = obtenerTemaOscuro();                   // Lee el tema guardado al abrir la página

  actualizarInterfaz({                                    // Aplica el tema antes de cargar fotos
    pintarEstado: false,
    pintarGaleria: false,
    pintarTema: true,
    esOscuro: esOscuro,
  });

  registrarEventos();                                     // Activa los listeners de usuario
  cargarFotos();                                          // Carga las fotos iniciales
};

// EJECUCIÓN DE CÓDIGO
iniciarAplicacion();                                      // Punto de entrada: todo empieza aquí
