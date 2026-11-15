// IMPORTACIÓN DE MÓDULOS — claseImagen.js y datos.js cargados antes en index.html

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
const btnFirst = document.getElementById("btn-first");  // botón « primero
const btnPrev = document.getElementById("btn-prev");  // botón ‹ anterior
const btnNext = document.getElementById("btn-next");  // botón › siguiente
const btnLast = document.getElementById("btn-last");  // botón » último
const reloj = document.getElementById("reloj");       // reloj digital

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
  }

  return tema;                                        // devuelve "light" o "night"
}

const obtenerTemaDesdeToggle = (estaMarcado) => {        // convierte checkbox a nombre de tema
  let tema = "light";                                 // tema por defecto

  if (estaMarcado) {                                  // si el toggle está activado
    tema = "night";                                   // es modo noche
  }

  return tema;                                        // devuelve el tema
}

const estaReproduciendoAutoplay = (intervaloActivo) => {  // ¿autoplay activo?
  let reproduciendo = false;                          // por defecto no

  if (intervaloActivo !== null) {                     // hay setInterval en marcha
    reproduciendo = true;                             // sí está reproduciendo
  }

  return reproduciendo;                               // devuelve true o false
}

const lineasCaracteristicas = (slide) => {               // genera líneas de estilo y episodios
  let lineas = [];                                    // array vacío de textos
  let episodios = "";                                 // texto de episodios

  if (typeof slide.episodios === "number") {          // si es número
    episodios = slide.episodios + " episodios";       // formatea con palabra episodios
  } else {
    episodios = slide.episodios;                      // usa texto tal cual (ej. «1100+ episodios»)
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
  } else {                                            // si estaba parado
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
        btnNext.addEventListener("click", () => main("siguiente"));  // › siguiente
        btnPrev.addEventListener("click", () => main("anterior"));  // ‹ anterior
        btnFirst.addEventListener("click", () => main("primero"));  // « primero
        btnLast.addEventListener("click", () => main("ultimo"));  // » último
        btnPlayPause.addEventListener("click", () => main("playPause"));  // play/pause
        themeToggle.addEventListener("change", () => main("tema"));  // tema día/noche
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
  }
}

// EJECUCIÓN DE CÓDIGO

document.addEventListener("DOMContentLoaded", () => main("arranque"));  // arranca la app
