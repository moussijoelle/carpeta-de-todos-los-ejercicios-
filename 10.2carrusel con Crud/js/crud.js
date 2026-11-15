// IMPORTACIÓN DE MÓDULOS — claseImagen.js y datos.js cargados antes en el HTML

// DECLARACIÓN DE VARIABLES
// (ninguna global: las funciones reciben la lista por parámetro)

// DECLARACIÓN DE FUNCIONES

// FUNCIONES INDEPENDIENTES — parámetros + return, sin tocar el DOM

const buscar = (lista, elemento) => {                  // busca por nombre en el array
  let encontrado = false;                            // bandera: ¿encontrado?
  let indice = -1;                                   // posición por defecto si no existe
  let i = 0;                                         // contador del bucle

  while (i < lista.length && !encontrado) {            // recorre hasta el final o hasta encontrar
    if (lista[i].nombre === elemento) {              // compara el nombre buscado
      indice = i;                                    // guarda la posición
      encontrado = true;                             // marca como encontrado
    }
    i++;                                             // avanza al siguiente elemento
  }

  return indice;                                     // devuelve posición o -1
}

const buscarPorTexto = (lista, texto) => {           // busca en nombre, estilo, descripción y episodios
  let encontrado = false;                            // bandera: ¿encontrado?
  let indice = -1;                                   // posición por defecto si no existe
  let i = 0;                                         // contador del bucle
  let busqueda = texto.trim().toLowerCase();         // texto normalizado para comparar

  while (i < lista.length && !encontrado) {          // recorre hasta el final o hasta encontrar
    let slide = lista[i];                            // slide actual del array
    let esPortada = false;                           // ¿es la portada?
    let esPaginaInfo = false;                        // ¿es la página info?
    let coincideNombre = false;                      // ¿coincide el nombre?
    let coincideEstilo = false;                      // ¿coincide el estilo?
    let coincideDescripcion = false;                 // ¿coincide la descripción?
    let coincideEpisodios = false;                   // ¿coinciden los episodios?

    if (slide.esIntro) {                             // comprueba si es portada
      esPortada = slide.esIntro();
    }
    if (slide.esInfo) {                              // comprueba si es página info
      esPaginaInfo = slide.esInfo();
    }

    if (!esPortada && !esPaginaInfo) {               // solo busca en animes
      coincideNombre = slide.nombre.toLowerCase().includes(busqueda);
      coincideEstilo = slide.title.toLowerCase().includes(busqueda);
      coincideDescripcion = slide.descripcion.toLowerCase().includes(busqueda);

      if (slide.episodios !== null && slide.episodios !== undefined) {  // hay episodios
        coincideEpisodios = String(slide.episodios).toLowerCase().includes(busqueda);
      }

      if (coincideNombre || coincideEstilo || coincideDescripcion || coincideEpisodios) {  // algún campo coincide
        indice = i;                                  // guarda la posición
        encontrado = true;                           // marca como encontrado
      }
    }

    i++;                                             // avanza al siguiente elemento
  }

  return indice;                                     // devuelve posición o -1
}

const obtenerIndiceInsercionAnime = (lista) => {     // posición antes del slide info final
  let indice = lista.length;                         // por defecto al final
  let i = 0;                                         // contador del bucle

  while (i < lista.length) {                         // recorre todos los slides
    if (lista[i].esInfo && lista[i].esInfo()) {      // encontró el slide info
      indice = i;                                    // guarda posición antes de insertar
    }
    i++;                                             // avanza al siguiente
  }

  return indice;                                     // devuelve índice de inserción
}

const contarAnimesEnLista = (lista) => {             // cuenta solo animes (sin portada ni info)
  let total = 0;                                     // contador de animes
  let i = 0;                                         // contador del bucle
  let esPortada = false;                             // ¿es portada?
  let esPaginaInfo = false;                          // ¿es slide info?

  while (i < lista.length) {                       // recorre todos los slides
    esPortada = false;                               // reinicia bandera
    esPaginaInfo = false;                            // reinicia bandera

    if (lista[i].esIntro) {                          // comprueba portada
      esPortada = lista[i].esIntro();
    }
    if (lista[i].esInfo) {                           // comprueba slide info
      esPaginaInfo = lista[i].esInfo();
    }

    if (!esPortada && !esPaginaInfo) {               // es un anime normal
      total = total + 1;                             // suma 1 al total
    }

    i++;                                             // avanza al siguiente
  }

  return total;                                      // devuelve cantidad de animes
}

const esSlideProtegido = (lista, posicion) => {      // comprueba portada (0) o slide info
  let protegido = false;                             // por defecto no protegido
  let slide = lista[posicion];                       // slide en esa posición

  if (posicion === 0) {                              // siempre protege la portada
    protegido = true;
  } else if (slide && slide.esIntro && slide.esIntro()) {  // otra portada en la lista
    protegido = true;
  } else if (slide && slide.esInfo && slide.esInfo()) {  // slide info final
    protegido = true;
  } else {                                           // anime normal
    protegido = false;
  }

  return protegido;                                  // devuelve true o false
}

const generarPuestoNuevoAnime = (numeroAnime) => {   // calcula el texto «Anime N»
  let puesto = "Anime " + numeroAnime;                 // ej. Anime 21
  return puesto;                                       // devuelve el puesto
}

const agregar = (lista, nuevaImagen) => {            // crea un elemento si no existe
  let posicion = buscar(lista, nuevaImagen.nombre);  // primero busca
  let indiceInsercion = obtenerIndiceInsercionAnime(lista);  // antes del slide info
  let numeroNuevoAnime = contarAnimesEnLista(lista) + 1;  // siguiente número de anime
  let resultado = {                                  // objeto resultado para main
    ok: false,                                       // ¿operación correcta?
    mensaje: "",                                     // texto para mostrar
    indice: -1,                                      // posición del nuevo elemento
  };

  if (posicion === -1) {                             // no existe: se puede crear
    nuevaImagen.puesto = generarPuestoNuevoAnime(numeroNuevoAnime);  // asigna Anime N
    lista.splice(indiceInsercion, 0, nuevaImagen);   // inserta en la lista de animes
    resultado.ok = true;                             // operación exitosa
    resultado.mensaje = nuevaImagen.puesto + " agregado a la lista.";  // mensaje de éxito
    resultado.indice = indiceInsercion;              // índice del nuevo anime
    guardarImagenes(lista);                          // persiste cambios en localStorage
  } else if (posicion >= 0) {                        // ya existe en la lista
    resultado.mensaje = "Ese anime ya existe.";      // mensaje de error
  }

  return resultado;                                  // devuelve resultado a main
}

const devolver = (lista, nombre) => {                // lee un elemento por nombre
  let posicion = buscar(lista, nombre);              // primero busca
  let resultado = {                                  // objeto resultado para main
    ok: false,                                       // ¿encontrado?
    mensaje: "",                                     // texto para mostrar
    imagen: null,                                    // objeto Imagen o null
    indice: -1,                                      // posición en el array
    textoHtml: "",                                   // toString() para pantalla
  };

  if (posicion === -1) {                             // no existe
    resultado.mensaje = "Ese anime no existe.";      // mensaje de error
  } else if (posicion >= 0) {                        // existe en la lista
    resultado.ok = true;                             // operación exitosa
    resultado.imagen = lista[posicion];              // guarda el objeto
    resultado.indice = posicion;                     // guarda la posición
    resultado.textoHtml = lista[posicion].toString();  // HTML para mostrar
    resultado.mensaje = "Anime encontrado.";         // mensaje de éxito
  }

  return resultado;                                  // devuelve resultado a main
}

const modificar = (lista, nombre, nuevosDatos) => {  // actualiza datos de un elemento
  let posicion = buscar(lista, nombre);              // primero busca
  let resultado = {                                  // objeto resultado para main
    ok: false,                                       // ¿operación correcta?
    mensaje: "",                                     // texto para mostrar
    indice: -1,                                      // posición modificada
  };
  let huboCambios = false;                           // ¿se modificó algún campo?
  let episodiosValor = nuevosDatos.episodios;        // valor de episodios a guardar

  if (posicion === -1) {                             // no existe
    resultado.mensaje = "Ese anime no existe.";      // mensaje de error
  } else if (esSlideProtegido(lista, posicion)) {    // portada o slide info
    resultado.mensaje = "No se puede modificar la portada ni el slide final.";
  } else {                                           // anime encontrado
    if (nuevosDatos.imagen !== "") {                 // modifica imagen
      lista[posicion].imagen = nuevosDatos.imagen;
      huboCambios = true;
    }
    if (nuevosDatos.title !== "") {                  // modifica estilo
      lista[posicion].title = nuevosDatos.title;
      huboCambios = true;
    }
    if (nuevosDatos.descripcion !== "") {            // modifica descripción
      lista[posicion].descripcion = nuevosDatos.descripcion;
      huboCambios = true;
    }
    if (nuevosDatos.episodios !== "") {              // modifica episodios
      if (!isNaN(Number(nuevosDatos.episodios))) {   // si es número
        episodiosValor = Number(nuevosDatos.episodios);
      } else {                                       // texto de episodios
        episodiosValor = nuevosDatos.episodios;
      }
      lista[posicion].episodios = episodiosValor;
      huboCambios = true;
    }

    if (huboCambios) {                               // hubo al menos un cambio
      resultado.ok = true;
      resultado.indice = posicion;
      resultado.mensaje = "Anime modificado correctamente.";
      guardarImagenes(lista);                        // persiste cambios en localStorage
    } else {                                         // ningún campo rellenado
      resultado.mensaje = "No hay datos para modificar.";
    }
  }

  return resultado;                                  // devuelve resultado a main
}

const eliminar = (lista, nombre, indiceActual) => {  // elimina un elemento por nombre
  let posicion = buscar(lista, nombre);              // primero busca
  let resultado = {                                  // objeto resultado para main
    ok: false,                                       // ¿operación correcta?
    mensaje: "",                                     // texto para mostrar
    indice: indiceActual,                            // índice sugerido tras borrar
  };

  if (posicion === -1) {                             // no existe
    resultado.mensaje = "Ese anime no existe.";      // mensaje de error
  } else if (esSlideProtegido(lista, posicion)) {    // portada o slide info
    resultado.mensaje = "No se puede eliminar la portada ni el slide final.";
  } else {                                           // existe: elimina
    lista.splice(posicion, 1);                       // quita 1 elemento en esa posición
    resultado.ok = true;                             // operación exitosa
    resultado.mensaje = "Anime eliminado correctamente.";  // mensaje de éxito

    if (lista.length === 0) {                        // lista vacía tras borrar
      resultado.indice = 0;                          // evita índice inválido
    } else if (indiceActual >= lista.length) {       // slide actual ya no existe
      resultado.indice = lista.length - 1;             // va al último slide
    } else if (indiceActual > posicion) {            // estaba después del borrado
      resultado.indice = indiceActual - 1;             // ajusta el índice
    } else {                                         // misma posición o anterior
      resultado.indice = indiceActual;                 // mantiene el índice actual
    }

    guardarImagenes(lista);                          // persiste cambios en localStorage
  }

  return resultado;                                  // devuelve resultado a main
}

// EJECUCIÓN DE CÓDIGO
// (este módulo solo declara funciones; main las invoca desde carrousel.js o admin.js)
