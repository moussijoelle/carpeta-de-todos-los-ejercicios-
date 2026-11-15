//MAPEAR HTML
const DETALLE_CONTENEDOR = document.getElementById('detalle-pokemon');
const BTN_PREV = document.getElementById('anterior');
const BTN_NEXT = document.getElementById('siguiente');
const LISTA = document.getElementById("lista-pokemons");
const ENC_LISTA = document.getElementById("enc-lista");
const LISTA_FAVORITOS = document.getElementById('lista-favoritos');
const BTN_AUDITAR = document.getElementById('btn-auditar');

const CLAVE_FAVORITOS = 'pokemonesFavoritos';

// VARIABLES GLOBALES
let urlSiguiente = 'https://pokeapi.co/api/v2/pokemon';
let urlAnterior = null; 
let contador = 0;
let inicio = true;
let numeroPokemones = 0

// DEFINICION DE FUNCIONES

const mostrarDatos = (resultado) => {
  LISTA.innerHTML = ""; 
  ENC_LISTA.innerText = `Pokémons ${contador + 1} al ${contador + 20}`;

  urlAnterior = resultado.previous;
  urlSiguiente = resultado.next;
   
  let htmlAside = ""; // Creamos un "saco" vacío fuera del bucle
  let pokemons = resultado.results;

  // La primera vez que muestra los datos actualiza el numero de pokemones
  if (inicio) { 
    numeroPokemones = resultado.count;
    inicio = false;
  }
  console.log(resultado);

  for (const valor of pokemons) {
    // Vamos SUMANDO (+=) los strings en la memoria del código, 
    // sin tocar la pantalla todavía
    htmlAside += `<p class="cursor-pointer hover:text-amber-400 mb-1" data-info="${valor.url}">
    ${contador+1}. ${valor.name}
    </p>`; 
    contador++;
  }
  // console.log(htmlAside)
  console.log(contador);
  // Al salir del bucle, inyectamos todo de un solo golpe en el DOM
  LISTA.innerHTML = htmlAside;  

}

const buscarDetallePokemon = async (url) => {
  try {
    const respuesta = await fetch(url);
    const pokemon = await respuesta.json();

    console.info(pokemon);
    
    // Extraemos la información que queremos mostrar
    const nombre = pokemon.name.toUpperCase();
    
    // URL de la foto frontal
    // const imagen = pokemon.sprites.front_default; // Pixelado (Estilo retro)
    const imagen = pokemon.sprites.other['official-artwork'].front_default; // HD
    
    const tipos = pokemon.types.map(t => t.type.name).join(', '); // Une los tipos con coma
    const id = pokemon.id;

    // Inyectamos el HTML en el contenedor de detalles
    DETALLE_CONTENEDOR.innerHTML = `
      <div class="flex flex-col items-center bg-slate-100 p-4 rounded-xl shadow-md">
        <span class="text-gray-500 font-bold text-lg">#${id}</span>
        <h2 class="text-3xl font-bold text-slate-800 mb-2">${nombre}</h2>
        <img src="${imagen}" alt="${nombre}" class="w-64 h-64 object-contain">
        <p class="text-lg text-slate-600 mt-2"><strong>Tipos:</strong> ${tipos}</p>
        <button type="button" id="btn-favorito"
          class="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
          Añadir a Favoritos
        </button>
      </div>
    `;

    DETALLE_CONTENEDOR.classList.remove('hidden');

    document.getElementById('btn-favorito').addEventListener('click', () => {
      guardarEnFavoritos({ id, nombre, imagen, tipos, url });
    });

  } catch (error) {
    console.error("Error al obtener el detalle del Pokémon:", error);
  }
}

const leerUrlPokemon = (e) => {
  // Buscamos si el usuario ha hecho clic en una <p> 
  const elementoClicado = e.target.closest('[data-info]');
  
  // Si efectivamente clicó en un Pokémon...
  if (elementoClicado) {
    // LEER EL DATO: Accedemos a data-info usando .dataset.info
    const urlPokemon = elementoClicado.dataset.info;    
    console.log(`¡Has clicado un Pokémon! Su URL es: ${urlPokemon}`);
    // Aquí llamamos a la función 
    // para hacer el fetch de los datos de ese Pokémon
    // ejemplo: buscarDetallePokemon(urlPokemon);
    buscarDetallePokemon(urlPokemon);
  }
}

LISTA.addEventListener('click', leerUrlPokemon);

const guardarEnFavoritos = (pokemon) => {
  try {
    const guardados = localStorage.getItem(CLAVE_FAVORITOS);
    let favoritos = guardados ? JSON.parse(guardados) : [];

    const yaExiste = favoritos.some((fav) => fav.id === pokemon.id);
    if (yaExiste) {
      alert(`${pokemon.nombre} ya está en favoritos`);
      return;
    }

    favoritos.push(pokemon);
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
    mostrarFavoritos();
    alert(`${pokemon.nombre} añadido a favoritos`);

  } catch (error) {
    console.error('No se pudo guardar en localStorage:', error);
  }
};

const mostrarFavoritos = () => {
  if (!LISTA_FAVORITOS) return;

  const guardados = localStorage.getItem(CLAVE_FAVORITOS);
  if (!guardados) {
    LISTA_FAVORITOS.innerHTML = '<p class="text-slate-500">No hay favoritos aún</p>';
    return;
  }

  const favoritos = JSON.parse(guardados);
  let html = '';

  for (const fav of favoritos) {
    html += `
      <div class="text-center bg-white p-2 rounded shadow">
        <img src="${fav.imagen}" alt="${fav.nombre}" class="w-20 h-20 object-contain mx-auto">
        <p class="text-sm font-bold">${fav.nombre}</p>
      </div>`;
  }

  LISTA_FAVORITOS.innerHTML = html;
};

const auditarLocalStorage = () => {
  console.log('=== Auditoría del localStorage ===');

  for (let i = 0; i < localStorage.length; i++) {
    const clave = localStorage.key(i);
    const valor = localStorage.getItem(clave);

    console.log(`Clave: ${clave}`);
    console.log(`Valor: ${valor}`);
  }
};

BTN_AUDITAR.addEventListener('click', auditarLocalStorage);

const cargarDatos = async (url) => {
  inicio = false;

  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json(); 
    mostrarDatos(resultado);

  } catch (error) {

    console.error("Hubo un problema al cargar los datos:", error);
  }
}

const paginaSiguiente = () => {  
  // alert(contador);
  if (contador == 0) {
    urlSiguiente = 'https://pokeapi.co/api/v2/pokemon';
  }
  cargarDatos(urlSiguiente);
}
BTN_NEXT.addEventListener("click", paginaSiguiente);

const paginaAnterior = () => {
  contador -= 40;
  // alert(contador);
  contador = Math.max(contador, 0);
  if (contador == 0) {
    urlSiguiente = 'https://pokeapi.co/api/v2/pokemon';
    cargarDatos(urlSiguiente);
  } else {
    cargarDatos(urlAnterior);
  }
}
BTN_PREV.addEventListener("click", paginaAnterior);

cargarDatos(urlSiguiente);
mostrarFavoritos();