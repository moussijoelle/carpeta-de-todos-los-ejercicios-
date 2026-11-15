// IMPORTACIÓN DE MÓDULOS — claseImagen.js, datos.js y crud.js cargados antes en index.html

// DECLARACIÓN DE VARIABLES

const mainCard = document.getElementById("main-card");  // tarjeta principal
const pageHeader = document.getElementById("page-header");  // cabecera de la página
const logoHeader = document.getElementById("logo-header");  // logo del encabezado
const tituloPrincipal = document.getElementById("titulo-principal");  // h1 del mapa de animes
const carouselSlide = document.getElementById("carousel-slide");  // sección del carrusel
const carouselFigure = document.getElementById("carousel-figure");  // marco de imagen o texto
const carouselIntro = document.getElementById("carousel-intro");  // bloque texto portada/info
const carouselImg = document.getElementById("carousel-img");  // imagen del anime
const introTitulo = document.getElementById("intro-titulo");  // título del bloque intro
const introSubtitulo = document.getElementById("intro-subtitulo");  // subtítulo o descripción corta
const introExtra = document.getElementById("intro-extra");  // párrafo extra slide info
const introFuente = document.getElementById("intro-fuente");  // contenedor del enlace
const introHint = document.getElementById("intro-hint");  // mensaje «Pulsa ›»
const animeInfo = document.getElementById("anime-info");  // bloque datos bajo la imagen
const animePuesto = document.getElementById("anime-puesto");  // badge «Anime N»
const animeNombre = document.getElementById("anime-nombre");  // nombre del anime
const animeDescripcion = document.getElementById("anime-descripcion");  // descripción del anime
const animeCaracteristicas = document.getElementById("anime-caracteristicas");  // lista estilo/episodios
const themeToggle = document.getElementById("theme-toggle");  // interruptor día/noche
const btnPlayPause = document.getElementById("btn-play-pause");  // botón autoplay
const btnFirst = document.getElementById("btn-first");  // botón « primero (desktop)
const btnPrev = document.getElementById("btn-prev");  // botón ‹ anterior (desktop)
const btnNext = document.getElementById("btn-next");  // botón › siguiente (desktop)
const btnLast = document.getElementById("btn-last");  // botón » último (desktop)
const btnFirstM = document.getElementById("btn-first-m");  // botón « primero (móvil)
const btnPrevM = document.getElementById("btn-prev-m");  // botón ‹ anterior (móvil)
const btnNextM = document.getElementById("btn-next-m");  // botón › siguiente (móvil)
const btnLastM = document.getElementById("btn-last-m");  // botón » último (móvil)
const reloj = document.getElementById("reloj");       // reloj digital
const inputCrudNombre = document.getElementById("crud-nombre");  // nombre para CRUD
const inputCrudImagen = document.getElementById("crud-imagen");  // selector de imagen (admin)
const vistaPreviaImagen = document.getElementById("vista-previa-imagen");  // miniatura de la foto elegida
const inputCrudEstilo = document.getElementById("crud-estilo");  // estilo del anime
const inputCrudDescripcion = document.getElementById("crud-descripcion");  // descripción
const inputCrudEpisodios = document.getElementById("crud-episodios");  // episodios
const btnBuscar = document.getElementById("btn-buscar");  // botón buscar
const btnAgregar = document.getElementById("btn-agregar");  // botón agregar
const mensajeCrud = document.getElementById("mensaje-crud");  // mensaje de feedback CRUD
const detalleCrud = document.getElementById("detalle-crud");  // detalle HTML del anime

const CLAVE_TEMA = "tema-anime-carrusel";             // clave para guardar tema en localStorage

const CLASES_CARD_NORMAL = ["p-4", "sm:p-5"];         // padding amplio de la card (portada)
const CLASES_CARD_COMPACTA = ["p-3"];                 // padding compacto (anime)
const CLASES_HEADER_NORMAL = ["mb-2", "pb-2"];        // cabecera amplia
const CLASES_HEADER_COMPACTO = ["mb-1", "pb-1"];      // cabecera compacta
const CLASES_LOGO_NORMAL = ["h-16", "w-16", "md:h-20", "md:w-20", "lg:h-24", "lg:w-24"];  // logo grande
const CLASES_LOGO_COMPACTO = ["h-11", "w-11", "md:h-12", "md:w-12"];  // logo pequeño
const CLASES_TITULO_NORMAL = ["text-2xl", "md:text-3xl", "tracking-wide"];  // título grande
const CLASES_TITULO_COMPACTO = ["text-base", "leading-tight"];  // título compacto
const CLASES_FIGURE_PADDING_NORMAL = ["px-2"];        // padding horizontal amplio
const CLASES_FIGURE_PADDING_COMPACTO = ["px-1"];      // padding horizontal compacto
const CLASES_IMG_ANIME = ["max-h-[50vh]", "md:max-h-[min(62vh,560px)]"];  // altura máxima imagen

let indexActual = 0;                                  // slide visible ahora (0 = portada)
let intervalo = null;                                 // id del setInterval del autoplay
let sentidoAutoplay = 1;                              // 1 avanza, -1 retrocede (ping-pong)
let intervaloReloj = null;                            // id del setInterval del reloj
let carruselIniciado = false;                         // evita enlazar escuchadores dos veces
let imagenSeleccionadaAdmin = "";                     // URL temporal de la foto elegida en admin

// DECLARACIÓN DE FUNCIONES

// FUNCIONES BIBLIOTECA — reutilizables (parámetros + return, sin tocar el DOM)

const calcularIndiceCircular = (indice, total) => {      // normaliza índice para lista circular
  let indiceValido = ((indice % total) + total) % total;  // vuelve al inicio/fin sin salirse
  return indiceValido;                                // devuelve índice válido
}

const calcularUltimoIndice = (total) => {                // última posición del array
  let ultimo = total - 1;                             // resta 1 al total
  return ultimo;                                      // devuelve último índice
}

const obtenerSlidePorIndice = (lista, indice) => {       // lee un slide del array
  let slide = lista[indice];                          // accede por posición
  return slide;                                       // devuelve el objeto Imagen
}

const obtenerTipoSlide = (slide) => {                    // decide si es intro, info o anime
  let tipo = "anime";                                 // por defecto es anime con foto

  if (slide.esIntro()) {                              // comprueba portada
    tipo = "intro";                                   // asigna tipo intro
  } else if (slide.esInfo()) {                        // comprueba página info
    tipo = "info";                                    // asigna tipo info
  }

  return tipo;                                        // devuelve "intro", "info" o "anime"
}

const calcularSiguienteIndice = (indice, total) => {     // índice del slide siguiente
  let nuevoIndice = calcularIndiceCircular(indice + 1, total);  // suma 1 con vuelta circular
  return nuevoIndice;                                 // devuelve nuevo índice
}

const calcularAnteriorIndice = (indice, total) => {      // índice del slide anterior
  let nuevoIndice = calcularIndiceCircular(indice - 1, total);  // resta 1 con vuelta circular
  return nuevoIndice;                                 // devuelve nuevo índice
}

const calcularDesplazamientoAutoplay = (indice, ultimo, sentido, total) => {  // lógica ping-pong del autoplay
  let nuevoSentido = sentido;                         // copia el sentido actual
  let nuevoIndice = indice;                           // copia el índice actual

  if (indice === ultimo && sentido === 1) {           // si está en el último y avanza
    nuevoSentido = -1;                                // invierte hacia atrás
  } else if (indice === 0 && sentido === -1) {        // si está en el primero y retrocede
    nuevoSentido = 1;                                 // invierte hacia adelante
  }

  nuevoIndice = calcularIndiceCircular(indice + nuevoSentido, total);  // calcula siguiente posición

  let resultado = {                                   // objeto con el resultado
    indice: nuevoIndice,                              // nuevo índice
    sentido: nuevoSentido,                            // nuevo sentido
  };

  return resultado;                                   // devuelve índice y sentido
}

const obtenerTemaGuardado = (clave) => {                 // lee tema guardado en localStorage
  let guardado = localStorage.getItem(clave);         // obtiene valor guardado
  let tema = "light";                                 // tema por defecto

  if (guardado === "night") {                         // si guardó modo noche
    tema = "night";                                   // asigna noche
  } else {                                             // tema claro por defecto
    tema = "light";                                   // asigna light
  }

  return tema;                                        // devuelve "light" o "night"
}

const obtenerTemaDesdeToggle = (estaMarcado) => {        // convierte checkbox a nombre de tema
  let tema = "light";                                 // tema por defecto

  if (estaMarcado) {                                  // si el toggle está activado
    tema = "night";                                   // es modo noche
  } else {                                             // toggle desactivado
    tema = "light";                                   // es modo claro
  }

  return tema;                                        // devuelve el tema
}

const estaReproduciendoAutoplay = (intervaloActivo) => {  // ¿autoplay activo?
  let reproduciendo = false;                          // por defecto no

  if (intervaloActivo !== null) {                     // hay setInterval en marcha
    reproduciendo = true;                             // sí está reproduciendo
  } else {                                             // sin intervalo activo
    reproduciendo = false;                            // no está reproduciendo
  }

  return reproduciendo;                               // devuelve true o false
}

const lineasCaracteristicas = (slide) => {               // genera líneas de estilo y episodios
  let lineas = [];                                    // array vacío de textos
  let episodios = "";                                 // texto de episodios

  if (typeof slide.episodios === "number") {          // si es número
    episodios = slide.episodios + " episodios";       // formatea con palabra episodios
  } else if (slide.episodios !== null) {             // texto de episodios
    episodios = slide.episodios;                      // usa texto tal cual
  } else {                                             // sin episodios
    episodios = "";                                   // cadena vacía
  }

  lineas.push("Estilo: " + slide.title);              // añade línea de estilo
  lineas.push("Episodios: " + episodios);             // añade línea de episodios

  return lineas;                                      // devuelve array de strings
}

const formatearHora = (fecha) => {                       // convierte Date a "HH:MM:SS"
  let horas = fecha.getHours();                       // hora actual
  let minutos = fecha.getMinutes();                   // minutos actuales
  let segundos = fecha.getSeconds();                  // segundos actuales

  horas = horas < 10 ? "0" + horas : horas;           // añade cero a la izquierda si hace falta
  minutos = minutos < 10 ? "0" + minutos : minutos;   // idem minutos
  segundos = segundos < 10 ? "0" + segundos : segundos;  // idem segundos

  let texto = horas + ":" + minutos + ":" + segundos;  // une con dos puntos
  return texto;                                       // devuelve cadena formateada
}

// FUNCIONES INDEPENDIENTES — parámetros + return, sin tocar el DOM

const validarArranque = (domListo, yaIniciado) => {      // comprueba si puede arrancar la app
  let listo = false;                                  // por defecto no

  if (domListo && !yaIniciado) {                      // HTML listo y no iniciado antes
    listo = true;                                     // puede arrancar
  } else if (yaIniciado) {                            // ya estaba iniciado
    listo = false;                                    // no vuelve a arrancar
  } else {                                            // DOM no listo
    listo = false;                                    // no puede arrancar
  }

  return listo;                                       // devuelve true o false
}

const construirVistaIntro = (slide) => {               // prepara datos de la portada
  let vista = {                                       // objeto con lo que hay que mostrar
    tipo: "intro",                                    // tipo de slide
    layout: "texto",                                  // layout amplio sin foto
    nombre: slide.nombre,                             // título
    descripcion: slide.descripcion,                   // texto principal
    parrafoExtra: "",                                 // sin párrafo largo
    fuenteUrl: slide.fuenteUrl,                       // URL enlace
    fuenteTexto: slide.fuenteTexto,                   // texto enlace
    mostrarHint: true,                                // muestra «Pulsa ›»
    esSlideInfo: false,                               // sin estilo info
    tituloOculto: true,                               // título solo para lectores de pantalla
  };

  return vista;                                       // devuelve vista lista para pintar
}

const construirVistaInfo = (slide) => {                // prepara datos de la página info
  let vista = {                                       // objeto con lo que hay que mostrar
    tipo: "info",                                     // tipo de slide
    layout: "texto",                                  // layout amplio sin foto
    nombre: slide.nombre,                             // título visible
    descripcion: slide.descripcion,                   // descripción corta
    parrafoExtra: slide.parrafoExtra,                 // párrafo largo
    fuenteUrl: slide.fuenteUrl,                       // URL Wikipedia
    fuenteTexto: slide.fuenteTexto,                   // texto del enlace
    mostrarHint: false,                               // oculta hint
    esSlideInfo: true,                                // estilo colores info
    tituloOculto: false,                              // título visible
  };

  return vista;                                       // devuelve vista lista para pintar
}

const construirVistaAnime = (slide, lineas) => {       // prepara datos de slide con foto
  let vista = {                                       // objeto con lo que hay que mostrar
    tipo: "anime",                                    // tipo de slide
    layout: "anime",                                  // layout compacto con foto
    nombre: slide.nombre,                             // nombre del anime
    descripcion: slide.descripcion,                   // descripción
    imagen: slide.imagen,                             // ruta de la portada
    puesto: slide.puesto,                             // badge Anime N
    lineas: lineas,                                   // estilo y episodios
  };

  return vista;                                       // devuelve vista lista para pintar
}

const generarVistaSlide = (slide, tipo) => {           // elige la función según el tipo
  let vista = null;                                   // resultado a devolver
  let lineas = [];                                    // líneas estilo/episodios

  switch (tipo) {                                     // según tipo de slide
    case "intro":                                     // portada
      vista = construirVistaIntro(slide);             // genera vista intro
      break;
    case "info":                                      // página info
      vista = construirVistaInfo(slide);              // genera vista info
      break;
    default:                                          // anime con foto
      lineas = lineasCaracteristicas(slide);          // calcula líneas estilo/episodios
      vista = construirVistaAnime(slide, lineas);     // genera vista anime
      break;
  }

  return vista;                                       // devuelve la vista generada
}

const generarEstadoPlayPause = (intervaloActivo) => {    // decide si arrancar o parar autoplay
  let estado = {                                      // objeto con el nuevo estado
    reproduciendo: estaReproduciendoAutoplay(intervaloActivo),  // ¿estaba activo?
    detener: false,                                   // ¿hay que parar?
    iniciar: false,                                   // ¿hay que iniciar?
  };

  if (estado.reproduciendo) {                         // si estaba en marcha
    estado.detener = true;                            // hay que parar
  } else if (!estado.reproduciendo) {                 // si estaba parado
    estado.iniciar = true;                            // hay que iniciar
  }

  return estado;                                      // devuelve decisión
}

const generarIndiceAutoplay = (indice, sentido, total) => {  // calcula siguiente índice ping-pong
  let ultimo = calcularUltimoIndice(total);           // última posición
  let desplazamiento = calcularDesplazamientoAutoplay(indice, ultimo, sentido, total);  // ping-pong
  return desplazamiento;                              // devuelve { indice, sentido }
}

const generarDatosTema = (tema) => {                   // prepara datos del tema para mostrar
  let datos = {                                       // objeto con lo que main pintará
    tema: tema,                                       // "light" o "night"
    toggleMarcado: tema === "night",                  // estado del checkbox
    clave: CLAVE_TEMA,                                // clave localStorage
  };

  return datos;                                       // devuelve datos del tema
}

const validarNombreCrud = (nombre) => {                  // comprueba que el nombre no esté vacío
  let valido = false;                                  // por defecto no válido

  if (nombre !== null && nombre !== undefined && nombre.trim() !== "") {  // hay texto
    valido = true;                                     // nombre válido
  } else {                                             // vacío o nulo
    valido = false;                                    // nombre no válido
  }

  return valido;                                       // devuelve true o false
}

const leerImagenArchivoComoDataUrl = (inputFile, alTerminar) => {  // lee foto del PC como data URL
  let archivo = null;                                 // archivo seleccionado
  let lector = new FileReader();                      // lector de archivos

  if (inputFile && inputFile.files && inputFile.files.length > 0) {  // hay archivo
    archivo = inputFile.files[0];                     // toma el primero
    lector.onload = () => {                           // cuando termina la lectura
      alTerminar(lector.result);                      // devuelve data URL persistente
    };
    lector.readAsDataURL(archivo);                    // convierte a base64
  } else {                                            // sin archivo
    alTerminar("");                                   // sin imagen
  }
}

const actualizarVistaPreviaImagen = (url, elementoImg) => {  // muestra u oculta la miniatura
  if (elementoImg && url !== "") {                    // hay imagen y elemento
    elementoImg.src = url;                            // asigna la foto
    elementoImg.classList.remove("hidden");           // muestra la miniatura
  } else if (elementoImg) {                           // sin imagen
    elementoImg.src = "";                             // limpia la foto
    elementoImg.classList.add("hidden");              // oculta la miniatura
  }
}

const limpiarSeleccionImagenAdmin = (inputFile, elementoImg) => {  // resetea la foto elegida
  imagenSeleccionadaAdmin = "";                       // borra la URL guardada

  if (inputFile) {                                    // si existe el selector
    inputFile.value = "";                             // limpia la selección
  }

  actualizarVistaPreviaImagen("", elementoImg);       // oculta la miniatura
}

const leerDatosFormularioCrud = (nombre, imagen, estilo, descripcion, episodios) => {  // empaqueta datos del formulario
  let datos = {                                        // objeto con los campos leídos
    nombre: nombre.trim(),                             // nombre sin espacios extra
    imagen: imagen,                                    // ruta o URL temporal de imagen
    title: estilo.trim(),                              // estilo / género
    descripcion: descripcion.trim(),                   // descripción
    episodios: episodios.trim(),                       // episodios
  };

  return datos;                                        // devuelve datos listos para usar
}

const construirImagenDesdeDatos = (datos, puesto) => {  // crea un objeto Imagen desde el formulario
  let episodiosValor = datos.episodios;              // valor de episodios tal cual

  if (datos.episodios !== "" && !isNaN(Number(datos.episodios))) {  // si es número
    episodiosValor = Number(datos.episodios);          // convierte a número
  } else if (datos.episodios !== "") {               // texto de episodios
    episodiosValor = datos.episodios;                  // usa texto tal cual
  } else {                                             // sin episodios
    episodiosValor = datos.episodios;                  // mantiene valor vacío
  }

  let nuevaImagen = new Imagen(                        // instancia Imagen
    datos.imagen,                                      // ruta
    datos.nombre,                                      // nombre
    datos.title,                                       // estilo
    datos.descripcion,                                 // descripción
    puesto,                                            // badge Anime N
    episodiosValor                                     // episodios
  );

  return nuevaImagen;                                  // devuelve el objeto creado
}

const generarDatosBotonPlay = (reproduciendo) => {     // prepara icono y estilo del botón play
  let datos = {                                       // objeto con lo que main pintará
    reproduciendo: reproduciendo,                     // ¿está en marcha?
    texto: "▶",                                       // icono por defecto
    clases: "btn btn-circle btn-success btn-sm text-white shrink-0",  // estilo verde
    ariaLabel: "Iniciar reproducción automática",     // accesibilidad
  };

  if (reproduciendo) {                                // si está activo
    datos.texto = "⏸";                               // icono pausa
    datos.clases = "btn btn-circle btn-error btn-sm text-white shrink-0";  // estilo rojo
    datos.ariaLabel = "Pausar reproducción automática";  // accesibilidad
  } else {                                             // si está parado
    datos.texto = "▶";                                 // icono play
    datos.clases = "btn btn-circle btn-success btn-sm text-white shrink-0";  // estilo verde
    datos.ariaLabel = "Iniciar reproducción automática";  // accesibilidad
  }

  return datos;                                       // devuelve datos del botón
}

// FUNCIÓN MAIN — única función que toca el DOM: lee, valida, llama, recibe return y muestra

const main = (accion, entrada) => {                    // función principal del programa
  let resultado = null;                               // variable para recibir returns
  let total = imagenes.length;                        // cantidad de slides
  let i = 0;                                          // contador de bucles
  let enlace = null;                                  // elemento enlace temporal
  let li = null;                                      // item de lista temporal

  switch (accion) {                                   // según acción recibida
    case "arranque": {                                // inicio de la aplicación
      let domListo = false;                           // flag DOM

      if (mainCard && btnNext) {                      // comprueba elementos
        domListo = true;                              // DOM disponible
      } else {                                        // faltan elementos
        domListo = false;                             // DOM no disponible
      }

      let listo = validarArranque(domListo, carruselIniciado);  // valida arranque

      if (listo) {                                    // si pasó validación
        carruselIniciado = true;                      // marca como iniciado
        resultado = obtenerTemaGuardado(CLAVE_TEMA);  // lee tema guardado
        resultado = generarDatosTema(resultado);      // prepara datos tema
        document.documentElement.setAttribute("data-theme", resultado.tema);  // aplica tema
        themeToggle.checked = resultado.toggleMarcado;  // sincroniza toggle
        localStorage.setItem(resultado.clave, resultado.tema);  // guarda preferencia
        main("slide", indexActual);                   // pinta primer slide
        intervaloReloj = setInterval(() => main("reloj", new Date()), 1000);  // arranca reloj
        btnNext.addEventListener("click", () => main("siguiente"));  // › siguiente desktop
        btnPrev.addEventListener("click", () => main("anterior"));  // ‹ anterior desktop
        btnFirst.addEventListener("click", () => main("primero"));  // « primero desktop
        btnLast.addEventListener("click", () => main("ultimo"));  // » último desktop
        if (btnNextM) btnNextM.addEventListener("click", () => main("siguiente"));  // › móvil
        if (btnPrevM) btnPrevM.addEventListener("click", () => main("anterior"));  // ‹ móvil
        if (btnFirstM) btnFirstM.addEventListener("click", () => main("primero"));  // « móvil
        if (btnLastM) btnLastM.addEventListener("click", () => main("ultimo"));  // » móvil
        btnPlayPause.addEventListener("click", () => main("playPause"));  // play/pause
        themeToggle.addEventListener("change", () => main("tema"));  // tema día/noche

        if (btnBuscar && inputCrudNombre && !document.getElementById("btn-devolver")) {  // solo página usuario
          btnBuscar.addEventListener("click", () => main("buscar", inputCrudNombre.value));  // buscar
        }
        if (inputCrudImagen && document.getElementById("btn-devolver")) {  // solo página admin
          inputCrudImagen.addEventListener("change", () => {  // al elegir una foto
            leerImagenArchivoComoDataUrl(inputCrudImagen, (dataUrl) => {  // lee archivo
              imagenSeleccionadaAdmin = dataUrl;      // guarda data URL persistente
              actualizarVistaPreviaImagen(imagenSeleccionadaAdmin, vistaPreviaImagen);  // muestra miniatura
            });
          });
        }
      }
      break;
    }
    case "slide": {                                   // mostrar un slide
    let indiceValido = calcularIndiceCircular(entrada, total);  // valida índice
    indexActual = indiceValido;                       // guarda índice actual
    let slide = obtenerSlidePorIndice(imagenes, indiceValido);  // lee slide
    let tipo = obtenerTipoSlide(slide);               // comprueba tipo
    resultado = generarVistaSlide(slide, tipo);       // genera vista (return)

    switch (resultado.layout) {                       // según layout del slide
      case "texto": {                                 // portada o info
      for (i = 0; i < CLASES_CARD_COMPACTA.length; i++) { mainCard.classList.remove(CLASES_CARD_COMPACTA[i]); }
      for (i = 0; i < CLASES_CARD_NORMAL.length; i++) { mainCard.classList.add(CLASES_CARD_NORMAL[i]); }
      for (i = 0; i < CLASES_HEADER_COMPACTO.length; i++) { pageHeader.classList.remove(CLASES_HEADER_COMPACTO[i]); }
      for (i = 0; i < CLASES_HEADER_NORMAL.length; i++) { pageHeader.classList.add(CLASES_HEADER_NORMAL[i]); }
      for (i = 0; i < CLASES_LOGO_COMPACTO.length; i++) { logoHeader.classList.remove(CLASES_LOGO_COMPACTO[i]); }
      for (i = 0; i < CLASES_LOGO_NORMAL.length; i++) { logoHeader.classList.add(CLASES_LOGO_NORMAL[i]); }
      for (i = 0; i < CLASES_TITULO_COMPACTO.length; i++) { tituloPrincipal.classList.remove(CLASES_TITULO_COMPACTO[i]); }
      for (i = 0; i < CLASES_TITULO_NORMAL.length; i++) { tituloPrincipal.classList.add(CLASES_TITULO_NORMAL[i]); }
      for (i = 0; i < CLASES_FIGURE_PADDING_COMPACTO.length; i++) { carouselFigure.classList.remove(CLASES_FIGURE_PADDING_COMPACTO[i]); }
      for (i = 0; i < CLASES_FIGURE_PADDING_NORMAL.length; i++) { carouselFigure.classList.add(CLASES_FIGURE_PADDING_NORMAL[i]); }
      for (i = 0; i < CLASES_IMG_ANIME.length; i++) { carouselImg.classList.remove(CLASES_IMG_ANIME[i]); }
      carouselIntro.classList.remove("hidden");
      carouselIntro.classList.add("flex");
      carouselImg.classList.add("hidden");
      carouselImg.removeAttribute("src");
      animeInfo.classList.add("hidden");

      if (resultado.esSlideInfo) {
        carouselIntro.classList.add("slide-info");
      } else {
        carouselIntro.classList.remove("slide-info");
      }

      introTitulo.textContent = resultado.nombre;

      if (resultado.tituloOculto) {
        introTitulo.classList.add("sr-only");
      } else {
        introTitulo.classList.remove("sr-only");
      }

      introSubtitulo.textContent = resultado.descripcion;
      introExtra.textContent = resultado.parrafoExtra;

      if (resultado.parrafoExtra !== "") {
        introExtra.classList.remove("hidden");
      } else {
        introExtra.classList.add("hidden");
      }

      introFuente.replaceChildren();

      if (resultado.fuenteUrl !== "" && resultado.fuenteTexto !== "") {
        enlace = document.createElement("a");
        enlace.href = resultado.fuenteUrl;
        enlace.textContent = resultado.fuenteTexto;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.className = "link link-hover text-sm underline";
        introFuente.appendChild(enlace);
        introFuente.classList.remove("hidden");
      } else {
        introFuente.classList.add("hidden");
      }

      if (resultado.mostrarHint) {
        introHint.classList.remove("hidden");
      } else {
        introHint.classList.add("hidden");
      }
      break;
      }
      default: {                                      // slide anime con foto
      for (i = 0; i < CLASES_CARD_NORMAL.length; i++) { mainCard.classList.remove(CLASES_CARD_NORMAL[i]); }
      for (i = 0; i < CLASES_CARD_COMPACTA.length; i++) { mainCard.classList.add(CLASES_CARD_COMPACTA[i]); }
      for (i = 0; i < CLASES_HEADER_NORMAL.length; i++) { pageHeader.classList.remove(CLASES_HEADER_NORMAL[i]); }
      for (i = 0; i < CLASES_HEADER_COMPACTO.length; i++) { pageHeader.classList.add(CLASES_HEADER_COMPACTO[i]); }
      for (i = 0; i < CLASES_LOGO_NORMAL.length; i++) { logoHeader.classList.remove(CLASES_LOGO_NORMAL[i]); }
      for (i = 0; i < CLASES_LOGO_COMPACTO.length; i++) { logoHeader.classList.add(CLASES_LOGO_COMPACTO[i]); }
      for (i = 0; i < CLASES_TITULO_NORMAL.length; i++) { tituloPrincipal.classList.remove(CLASES_TITULO_NORMAL[i]); }
      for (i = 0; i < CLASES_TITULO_COMPACTO.length; i++) { tituloPrincipal.classList.add(CLASES_TITULO_COMPACTO[i]); }
      for (i = 0; i < CLASES_FIGURE_PADDING_NORMAL.length; i++) { carouselFigure.classList.remove(CLASES_FIGURE_PADDING_NORMAL[i]); }
      for (i = 0; i < CLASES_FIGURE_PADDING_COMPACTO.length; i++) { carouselFigure.classList.add(CLASES_FIGURE_PADDING_COMPACTO[i]); }
      for (i = 0; i < CLASES_IMG_ANIME.length; i++) { carouselImg.classList.add(CLASES_IMG_ANIME[i]); }
      introTitulo.classList.add("sr-only");
      carouselIntro.classList.remove("slide-info");
      carouselIntro.classList.add("hidden");
      carouselIntro.classList.remove("flex");
      carouselImg.classList.remove("hidden");
      animeInfo.classList.remove("hidden");
      carouselImg.src = resultado.imagen;
      carouselImg.alt = "Portada de " + resultado.nombre;
      animePuesto.textContent = resultado.puesto;
      animeNombre.textContent = resultado.nombre;
      animeDescripcion.textContent = resultado.descripcion;
      animeDescripcion.classList.remove("hidden");
      animeCaracteristicas.replaceChildren();

      for (i = 0; i < resultado.lineas.length; i++) {
        li = document.createElement("li");
        li.textContent = resultado.lineas[i];
        animeCaracteristicas.appendChild(li);
      }
      break;
      }
    }
    break;
    }
    case "siguiente":                                  // botón ›
      resultado = calcularSiguienteIndice(indexActual, total);  // calcula índice
      main("slide", resultado);                       // muestra slide
      break;
    case "anterior":                                   // botón ‹
      resultado = calcularAnteriorIndice(indexActual, total);  // calcula índice
      main("slide", resultado);                       // muestra slide
      break;
    case "primero":                                    // botón «
      main("slide", 0);                               // va a portada
      break;
    case "ultimo":                                     // botón »
      resultado = calcularUltimoIndice(total);        // última posición
      main("slide", resultado);                       // muestra último slide
      break;
    case "autoplay":                                   // tick cada 3 s
      resultado = generarIndiceAutoplay(indexActual, sentidoAutoplay, total);  // calcula
      sentidoAutoplay = resultado.sentido;            // guarda sentido
      main("slide", resultado.indice);                // muestra slide
      break;
    case "playPause": {                               // botón play/pause
      resultado = generarEstadoPlayPause(intervalo);  // decide acción

      if (resultado.detener) {                        // parar autoplay
        clearInterval(intervalo);                     // cancela intervalo
        intervalo = null;                             // limpia referencia
        resultado = generarDatosBotonPlay(false);     // datos botón play
        btnPlayPause.textContent = resultado.texto;   // icono play
        btnPlayPause.className = resultado.clases;    // estilo verde
        btnPlayPause.setAttribute("aria-label", resultado.ariaLabel);  // accesibilidad
      } else if (resultado.iniciar) {                 // iniciar autoplay
        sentidoAutoplay = 1;                          // empieza hacia adelante
        intervalo = setInterval(() => main("autoplay"), 3000);  // cada 3 segundos
        resultado = generarDatosBotonPlay(true);      // datos botón pausa
        btnPlayPause.textContent = resultado.texto;   // icono pausa
        btnPlayPause.className = resultado.clases;    // estilo rojo
        btnPlayPause.setAttribute("aria-label", resultado.ariaLabel);  // accesibilidad
      }
      break;
    }
    case "tema":                                       // cambio día/noche
      resultado = obtenerTemaDesdeToggle(themeToggle.checked);  // lee tema
      resultado = generarDatosTema(resultado);        // prepara datos
      document.documentElement.setAttribute("data-theme", resultado.tema);  // aplica tema
      themeToggle.checked = resultado.toggleMarcado;  // sincroniza toggle
      localStorage.setItem(resultado.clave, resultado.tema);  // guarda preferencia
      break;
    case "reloj":                                      // actualiza reloj
      resultado = formatearHora(entrada);             // formatea hora

      if (reloj) {                                    // si existe el elemento
        reloj.textContent = resultado;                // muestra en pantalla
      }
      break;
    case "buscar": {                                   // CRUD: buscar anime
      let textoBuscar = entrada;                      // texto recibido desde el botón
      let textoValido = validarNombreCrud(textoBuscar);  // valida entrada
      let indiceBusqueda = -1;                        // posición por defecto
      let esPaginaUsuario = false;                    // ¿es la página principal?

      if (!document.getElementById("btn-devolver")) {  // no hay botón devolver
        esPaginaUsuario = true;                       // es página usuario
      } else {                                        // hay botón devolver
        esPaginaUsuario = false;                      // es página admin
      }

      if (textoValido) {                              // solo busca si hay texto
        if (esPaginaUsuario) {                        // búsqueda multi-campo en usuario
          indiceBusqueda = buscarPorTexto(imagenes, textoBuscar.trim());
        } else {                                      // búsqueda exacta por nombre en admin
          indiceBusqueda = buscar(imagenes, textoBuscar.trim());
        }
      }

      if (!textoValido) {                             // texto vacío
        if (mensajeCrud) {
          if (esPaginaUsuario) {                      // mensaje para usuario
            mensajeCrud.textContent = "Escribe algo para buscar.";
          } else {                                    // mensaje para admin
            mensajeCrud.textContent = "Escribe un nombre para buscar.";
          }
        }
        if (detalleCrud) {
          detalleCrud.innerHTML = "";
        }
      } else if (indiceBusqueda === -1) {             // no encontrado
        if (mensajeCrud) {
          if (esPaginaUsuario) {                      // mensaje para usuario
            mensajeCrud.textContent = "No se encontró ningún anime.";
          } else {                                    // mensaje para admin
            mensajeCrud.textContent = "Ese anime no existe.";
          }
        }
        if (detalleCrud) {
          detalleCrud.innerHTML = "";
        }
      } else {                                        // encontrado
        if (mensajeCrud) {
          if (imagenes[indiceBusqueda].puesto !== "") {  // es un anime de la lista
            mensajeCrud.textContent = imagenes[indiceBusqueda].puesto + " encontrado.";
          } else {                                    // portada o slide info
            mensajeCrud.textContent = "Encontrado en la posición " + indiceBusqueda + ".";
          }
        }
        main("slide", indiceBusqueda);                // muestra el slide (MOSTRAR)
      }
      break;
    }
    case "agregar": {                                  // CRUD: crear anime
      let nombreLeido = "";                           // valor por defecto
      let imagenLeida = "";                           // valor por defecto
      let estiloLeido = "";                           // valor por defecto
      let descripcionLeida = "";                      // valor por defecto
      let episodiosLeidos = "";                       // valor por defecto
      if (inputCrudNombre) {                          // lee nombre
        nombreLeido = inputCrudNombre.value;
      }
      imagenLeida = imagenSeleccionadaAdmin;            // usa la foto elegida del PC

      if (inputCrudEstilo) {                          // lee estilo
        estiloLeido = inputCrudEstilo.value;
      }
      if (inputCrudDescripcion) {                     // lee descripción
        descripcionLeida = inputCrudDescripcion.value;
      }
      if (inputCrudEpisodios) {                       // lee episodios
        episodiosLeidos = inputCrudEpisodios.value;
      }

      let datosAgregar = leerDatosFormularioCrud(     // empaqueta datos
        nombreLeido,
        imagenLeida,
        estiloLeido,
        descripcionLeida,
        episodiosLeidos
      );

      let agregarValido = validarNombreCrud(datosAgregar.nombre);  // valida nombre

      if (!agregarValido) {                           // falta nombre
        if (mensajeCrud) {
          mensajeCrud.textContent = "El nombre es obligatorio para agregar.";  // aviso
        }
      } else {                                        // nombre válido
        let nuevaImagen = construirImagenDesdeDatos(datosAgregar, "");  // puesto lo asigna agregar()
        resultado = agregar(imagenes, nuevaImagen);   // inserta en la lista de animes

        if (mensajeCrud) {                            // muestra mensaje devuelto
          mensajeCrud.textContent = resultado.mensaje;
        }

        if (resultado.ok) {                           // agregado correctamente
          limpiarSeleccionImagenAdmin(inputCrudImagen, vistaPreviaImagen);  // limpia la foto elegida
          main("slide", resultado.indice);            // muestra el nuevo slide (MOSTRAR)
        }
      }
      break;
    }
    case "devolver": {                                 // CRUD: leer anime (admin)
      let nombreDevolver = entrada;                     // nombre recibido
      let devolverValido = validarNombreCrud(nombreDevolver);  // valida entrada

      if (!devolverValido) {                          // nombre vacío
        if (mensajeCrud) {
          mensajeCrud.textContent = "Escribe un nombre para devolver.";  // aviso
        }
        if (detalleCrud) {
          detalleCrud.innerHTML = "";
        }
      } else {                                        // nombre válido
        resultado = devolver(imagenes, nombreDevolver.trim());  // llama función independiente

        if (mensajeCrud) {                            // muestra mensaje
          mensajeCrud.textContent = resultado.mensaje;
        }

        if (resultado.ok) {                           // anime encontrado
          if (detalleCrud) {
            detalleCrud.innerHTML = resultado.textoHtml;  // muestra toString()
          }
          main("slide", resultado.indice);            // muestra slide (MOSTRAR)
        } else if (detalleCrud) {                     // anime no encontrado
          detalleCrud.innerHTML = "";
        }
      }
      break;
    }
    case "modificar": {                                // CRUD: actualizar anime (admin)
      let nombreModificar = "";                       // valor por defecto
      let imagenModificar = "";                       // valor por defecto
      let estiloModificar = "";                       // valor por defecto
      let descripcionModificar = "";                  // valor por defecto
      let episodiosModificar = "";                    // valor por defecto

      if (entrada && entrada.nombre) {                // si main recibe objeto entrada
        nombreModificar = entrada.nombre;
      } else if (inputCrudNombre) {
        nombreModificar = inputCrudNombre.value;
      }

      imagenModificar = imagenSeleccionadaAdmin;        // usa nueva foto si se eligió una

      if (inputCrudEstilo) {                          // lee estilo
        estiloModificar = inputCrudEstilo.value;
      }
      if (inputCrudDescripcion) {                     // lee descripción
        descripcionModificar = inputCrudDescripcion.value;
      }
      if (inputCrudEpisodios) {                       // lee episodios
        episodiosModificar = inputCrudEpisodios.value;
      }

      let modificarValido = validarNombreCrud(nombreModificar);  // valida nombre

      if (!modificarValido) {                         // falta nombre
        if (mensajeCrud) {
          mensajeCrud.textContent = "El nombre es obligatorio para modificar.";  // aviso
        }
      } else {                                        // nombre válido
        let datosModificar = leerDatosFormularioCrud( // empaqueta datos nuevos
          nombreModificar,
          imagenModificar,
          estiloModificar,
          descripcionModificar,
          episodiosModificar
        );

        resultado = modificar(imagenes, datosModificar.nombre, datosModificar);  // llama función

        if (mensajeCrud) {                            // muestra mensaje
          mensajeCrud.textContent = resultado.mensaje;
        }

        if (resultado.ok) {                           // modificado correctamente
          limpiarSeleccionImagenAdmin(inputCrudImagen, vistaPreviaImagen);  // limpia la foto elegida
          main("slide", resultado.indice);            // muestra slide actualizado (MOSTRAR)
        }
      }
      break;
    }
    case "eliminar": {                                 // CRUD: borrar anime (admin)
      let nombreEliminar = entrada;                     // nombre recibido
      let eliminarValido = validarNombreCrud(nombreEliminar);  // valida entrada

      if (!eliminarValido) {                          // nombre vacío
        if (mensajeCrud) {
          mensajeCrud.textContent = "Escribe un nombre para eliminar.";  // aviso
        }
      } else {                                        // nombre válido
        resultado = eliminar(imagenes, nombreEliminar.trim(), indexActual);  // llama función

        if (mensajeCrud) {                            // muestra mensaje
          mensajeCrud.textContent = resultado.mensaje;
        }

        if (resultado.ok) {                           // eliminado correctamente
          if (detalleCrud) {
            detalleCrud.innerHTML = "";
          }
          main("slide", resultado.indice);            // muestra lista actualizada (MOSTRAR)
        }
      }
      break;
    }
  }
}

// EJECUCIÓN DE CÓDIGO

document.addEventListener("DOMContentLoaded", () => main("arranque"));  // arranca la app
