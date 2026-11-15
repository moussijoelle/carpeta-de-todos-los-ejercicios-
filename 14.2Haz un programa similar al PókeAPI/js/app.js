const DETALLE_CONTENEDOR = document.getElementById('detalle-pelicula');
const BTN_PREV = document.getElementById('anterior');
const BTN_NEXT = document.getElementById('siguiente');
const LISTA = document.getElementById('lista-peliculas');
const ENC_LISTA = document.getElementById('enc-lista');

const API_FILMS = 'https://ghibliapi.vercel.app/films';
const PELICULAS_POR_PAGINA = 10;

let todasLasPeliculas = [];
let paginaActual = 0;
let totalPaginas = 0;

const mostrarPagina = () => {
  const inicio = paginaActual * PELICULAS_POR_PAGINA;
  const fin = Math.min(inicio + PELICULAS_POR_PAGINA, todasLasPeliculas.length);
  const peliculasPagina = todasLasPeliculas.slice(inicio, fin);

  LISTA.innerHTML = '';
  ENC_LISTA.innerText = `Películas ${inicio + 1} al ${fin}`;

  let htmlAside = '';
  let numero = inicio + 1;

  for (const pelicula of peliculasPagina) {
    htmlAside += `<p class="cursor-pointer hover:text-emerald-400 mb-1" data-id="${pelicula.id}">
    ${numero}. ${pelicula.title}
    </p>`;
    numero++;
  }

  LISTA.innerHTML = htmlAside;

  BTN_PREV.disabled = paginaActual === 0;
  BTN_NEXT.disabled = paginaActual >= totalPaginas - 1;
};

const buscarDetallePelicula = async (id) => {
  try {
    const respuesta = await fetch(`${API_FILMS}/${id}`);
    const pelicula = await respuesta.json();

    console.info(pelicula);

    const titulo = pelicula.title;
    const tituloOriginal = pelicula.original_title;
    const imagen = pelicula.image;
    const director = pelicula.director;
    const anio = pelicula.release_date;
    const duracion = pelicula.running_time;
    const puntuacion = pelicula.rt_score;
    const sinopsis = pelicula.description;

    DETALLE_CONTENEDOR.innerHTML = `
      <div class="flex flex-col items-center bg-slate-100 p-4 rounded-xl shadow-md max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-slate-800 mb-1">${titulo}</h2>
        <p class="text-gray-500 mb-3">${tituloOriginal}</p>
        <img src="${imagen}" alt="${titulo}" class="w-64 rounded-lg shadow-md object-cover">
        <p class="text-lg text-slate-600 mt-3"><strong>Director:</strong> ${director}</p>
        <p class="text-lg text-slate-600"><strong>Año:</strong> ${anio}</p>
        <p class="text-lg text-slate-600"><strong>Duración:</strong> ${duracion} min</p>
        <p class="text-lg text-slate-600"><strong>Puntuación:</strong> ${puntuacion}/100</p>
        <p class="text-slate-600 mt-3 text-sm leading-relaxed">${sinopsis}</p>
      </div>
    `;

    DETALLE_CONTENEDOR.classList.remove('hidden');

  } catch (error) {
    console.error('Error al obtener el detalle de la película:', error);
  }
};

const leerIdPelicula = (e) => {
  const elementoClicado = e.target.closest('[data-id]');

  if (elementoClicado) {
    const idPelicula = elementoClicado.dataset.id;
    console.log(`Has clicado una película. Su id es: ${idPelicula}`);
    buscarDetallePelicula(idPelicula);
  }
};

LISTA.addEventListener('click', leerIdPelicula);

const cargarPeliculas = async () => {
  try {
    const respuesta = await fetch(API_FILMS);
    todasLasPeliculas = await respuesta.json();
    totalPaginas = Math.ceil(todasLasPeliculas.length / PELICULAS_POR_PAGINA);
    paginaActual = 0;
    mostrarPagina();

  } catch (error) {
    console.error('Hubo un problema al cargar las películas:', error);
  }
};

const paginaSiguiente = () => {
  if (paginaActual < totalPaginas - 1) {
    paginaActual++;
    mostrarPagina();
  }
};

const paginaAnterior = () => {
  if (paginaActual > 0) {
    paginaActual--;
    mostrarPagina();
  }
};

BTN_NEXT.addEventListener('click', paginaSiguiente);
BTN_PREV.addEventListener('click', paginaAnterior);

cargarPeliculas();
