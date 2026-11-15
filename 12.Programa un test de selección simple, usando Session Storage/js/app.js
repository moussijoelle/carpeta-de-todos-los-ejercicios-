// IMPORTACIÓN DE MÓDULOS — clase.js y datos.js cargados antes en index.html

// MAPEO DEL DOM

const contador = document.getElementById("contador");                    // texto «Pregunta X de 20»
const enunciado = document.getElementById("enunciado");                  // enunciado de la pregunta
const opA = document.getElementById("op-a");                             // texto opción a
const opB = document.getElementById("op-b");                             // texto opción b
const opC = document.getElementById("op-c");                             // texto opción c
const opD = document.getElementById("op-d");                             // texto opción d
const radios = document.querySelectorAll('input[name="respuesta"]');      // los 4 radio buttons

const btnAnterior = document.getElementById("btn-anterior");             // botón pregunta anterior
const btnVerificar = document.getElementById("btn-verificar");           // botón verificar respuesta
const btnSiguiente = document.getElementById("btn-siguiente");           // botón pregunta siguiente
const btnReiniciar = document.getElementById("btn-reiniciar");           // botón reiniciar test

const vistaTest = document.getElementById("vista-test");                 // bloque del cuestionario
const vistaResultados = document.getElementById("vista-resultados");     // bloque de resultados finales
const resultados = document.getElementById("resultados");                // contenedor html de resultados

const modal = document.getElementById("modal");                          // ventana de justificación
const textoJustificacion = document.getElementById("justificacion");     // texto dentro del modal

// DECLARACIÓN DE VARIABLES

const CLAVE_SESSION = "preguntas";                                       // clave en sessionStorage
const LETRAS = ["a", "b", "c", "d"];                                     // letras de las opciones

let indiceActual = 0;                                                    // pregunta visible ahora
let listaPreguntas = [];                                                 // array de trabajo del test

// DECLARACIÓN DE FUNCIONES

const leerSession = (clave) => {                                         // lee texto guardado en sessionStorage
  let datos = sessionStorage.getItem(clave);                             // obtiene el valor por clave
  return datos;                                                          // devuelve texto o null
};

const guardarSession = (clave, lista) => {                                 // guarda el array en sessionStorage
  let texto = JSON.stringify(lista);                                     // convierte objetos a texto json
  sessionStorage.setItem(clave, texto);                                  // escribe en sessionStorage
};

const borrarSession = (clave) => {                                       // elimina datos guardados del test
  sessionStorage.removeItem(clave);                                      // borra la clave del almacén
};

const parsearLista = (texto) => {                                        // convierte texto json a array
  let lista = JSON.parse(texto);                                         // parsea el string a objetos
  return lista;                                                          // devuelve el array de preguntas
};

const obtenerPreguntaPorIndice = (lista, indice) => {                     // devuelve una pregunta del array
  let pregunta = lista[indice];                                          // accede por posición
  return pregunta;                                                       // devuelve el objeto Pregunta
};

const esUltimaPregunta = (indice, total) => {                            // comprueba si es la última pregunta
  let esUltima = false;                                                  // resultado por defecto

  if (indice === total - 1) {                                            // si está en la última posición
    esUltima = true;                                                     // marca como última
  } else {                                                               // si no es la última
    esUltima = false;                                                    // mantiene falso
  }

  return esUltima;                                                       // devuelve true o false
};

const esPrimeraPregunta = (indice) => {                                  // comprueba si es la primera pregunta
  let esPrimera = false;                                                 // resultado por defecto

  if (indice === 0) {                                                    // si el índice es cero
    esPrimera = true;                                                    // marca como primera
  } else {                                                               // si no es la primera
    esPrimera = false;                                                   // mantiene falso
  }

  return esPrimera;                                                      // devuelve true o false
};

const hayOpcionMarcada = (nodoMarcado) => {                              // comprueba si hay radio seleccionado
  let hayMarcada = false;                                                // resultado por defecto

  if (nodoMarcado) {                                                     // si existe el nodo marcado
    hayMarcada = true;                                                   // hay opción elegida
  } else {                                                               // si no hay nodo
    hayMarcada = false;                                                  // no hay opción elegida
  }

  return hayMarcada;                                                     // devuelve true o false
};

const comprobarRespuesta = (pregunta, opcionElegida) => {                 // compara respuesta con la correcta
  let acierto = false;                                                   // resultado por defecto

  if (opcionElegida === pregunta.opcionCorrecta) {                       // si coincide con la correcta
    acierto = true;                                                      // la respuesta es correcta
  } else {                                                               // si no coincide
    acierto = false;                                                     // la respuesta es incorrecta
  }

  return acierto;                                                        // devuelve true o false
};

const calcularPuntosAsignados = (pregunta, acierto) => {                 // calcula puntos según acierto
  let puntos = 0;                                                        // puntos por defecto

  if (acierto) {                                                         // si acertó
    puntos = pregunta.puntosPregunta;                                    // asigna puntos completos
  } else {                                                               // si falló
    puntos = 0;                                                          // no suma puntos
  }

  return puntos;                                                         // devuelve los puntos obtenidos
};

const construirMensajeVerificacion = (acierto, justificacion) => {       // arma el texto del modal
  let mensaje = "";                                                      // texto vacío al inicio

  if (acierto) {                                                         // si la respuesta es correcta
    mensaje = "Correcta. " + justificacion;                              // mensaje de acierto
  } else {                                                               // si la respuesta es incorrecta
    mensaje = "Incorrecta. " + justificacion;                            // mensaje de fallo
  }

  return mensaje;                                                        // devuelve el texto final
};

const construirHtmlResultados = (lista) => {                             // genera html de resultados finales
  let html = "";                                                         // acumulador de html
  let total = 0;                                                         // suma total de puntos
  let i = 0;                                                             // contador del bucle

  while (i < lista.length) {                                             // recorre todas las preguntas
    let p = lista[i];                                                    // pregunta actual del array
    total = total + p.puntosAsignados;                                   // suma puntos de esta pregunta

    html = html + '<p class="mb-3 border-b border-slate-200 pb-2">';     // abre párrafo de resultado
    html = html + "<strong>" + (i + 1) + ".</strong> " + p.texto + "<br>"; // número y enunciado
    html = html + "Elegiste: " + (p.opcionSeleccionada || "—") + " | "; // opción elegida por el usuario
    html = html + "Puntos: " + p.puntosAsignados + " / " + p.puntosPregunta; // puntos obtenidos
    html = html + "</p>";                                                // cierra el párrafo

    i = i + 1;                                                           // avanza al siguiente índice
  }

  html = html + '<p class="font-bold text-brand">Total: ' + total + " puntos</p>"; // línea del total

  return html;                                                           // devuelve html completo
};

const prepararListaInicial = () => {                                     // carga preguntas al arrancar
  let lista = [];                                                        // array vacío de trabajo
  let guardadas = leerSession(CLAVE_SESSION);                            // lee si hay test guardado

  if (guardadas) {                                                       // si hay datos en sessionStorage
    lista = parsearLista(guardadas);                                     // recupera el test guardado
  } else {                                                               // si no hay datos guardados
    lista = preguntas;                                                   // usa las 20 de datos.js
    guardarSession(CLAVE_SESSION, lista);                                // guarda la lista inicial
  }

  return lista;                                                          // devuelve el array listo
};

const prepararDatosVerificacion = (pregunta, opcionElegida) => {          // prepara resultado de verificar
  let acierto = comprobarRespuesta(pregunta, opcionElegida);             // comprueba si acertó
  let puntos = calcularPuntosAsignados(pregunta, acierto);              // calcula puntos obtenidos
  let mensaje = construirMensajeVerificacion(acierto, pregunta.justificacion); // texto para el modal

  let datos = {                                                          // objeto con el resultado
    acierto: acierto,                                                    // si fue correcta o no
    puntos: puntos,                                                      // puntos asignados
    mensaje: mensaje                                                     // texto del modal
  };

  return datos;                                                          // devuelve el objeto resultado
};

const main = (operacion, entrada) => {                                   // función principal que toca el dom
  let resultado = null;                                                  // valor de retorno por defecto

  switch (operacion) {                                                   // según la operación recibida
    case "arranque": {                                                   // inicio de la aplicación
      listaPreguntas = prepararListaInicial();                           // carga o recupera preguntas
      indiceActual = 0;                                                  // empieza en la primera
      main("mostrar", null);                                             // pinta la primera pregunta
      break;
    }
    case "mostrar": {                                                    // muestra pregunta en pantalla
      let p = obtenerPreguntaPorIndice(listaPreguntas, indiceActual);    // pregunta actual
      let opsTexto = [opA, opB, opC, opD];                              // spans de las 4 opciones
      let i = 0;                                                         // contador del bucle

      contador.textContent = "Pregunta " + (indiceActual + 1) + " de " + listaPreguntas.length; // contador
      enunciado.textContent = (indiceActual + 1) + ". " + p.texto;       // enunciado numerado

      while (i < LETRAS.length) {                                        // recorre a, b, c y d
        opsTexto[i].textContent = LETRAS[i] + ". " + p.opciones[i];     // texto de cada opción
        radios[i].checked = p.opcionSeleccionada === LETRAS[i];          // marca la opción guardada
        i = i + 1;                                                       // siguiente opción
      }

      if (esPrimeraPregunta(indiceActual)) {                             // si es la primera pregunta
        btnAnterior.disabled = true;                                     // desactiva botón anterior
      } else {                                                           // si no es la primera
        btnAnterior.disabled = false;                                    // activa botón anterior
      }
      break;
    }
    case "elegir": {                                                     // usuario elige una opción
      listaPreguntas[indiceActual].opcionSeleccionada = entrada;         // guarda letra en el objeto
      guardarSession(CLAVE_SESSION, listaPreguntas);                     // persiste en sessionStorage
      break;
    }
    case "verificar": {                                                  // usuario pulsa verificar
      let marcada = document.querySelector('input[name="respuesta"]:checked'); // radio marcado ahora
      let hayMarcada = hayOpcionMarcada(marcada);                        // comprueba si hay selección

      if (hayMarcada) {                                                  // si eligió una opción
        let p = obtenerPreguntaPorIndice(listaPreguntas, indiceActual);  // pregunta actual
        let opcionElegida = marcada.value;                               // letra elegida a/b/c/d
        let datos = prepararDatosVerificacion(p, opcionElegida);         // calcula acierto y puntos

        p.opcionSeleccionada = opcionElegida;                           // actualiza opción seleccionada
        p.puntosAsignados = datos.puntos;                                // actualiza puntos asignados
        guardarSession(CLAVE_SESSION, listaPreguntas);                   // guarda cambios en sessionStorage

        textoJustificacion.textContent = datos.mensaje;                  // escribe texto en el modal
        modal.showModal();                                               // abre la ventana de justificación
      } else {                                                           // si no eligió ninguna opción
        alert("Elige una opción antes de verificar.");                   // avisa al usuario
      }
      break;
    }
    case "anterior": {                                                   // ir a pregunta anterior
      if (esPrimeraPregunta(indiceActual)) {                             // si ya está en la primera
        resultado = indiceActual;                                        // no cambia de índice
      } else {                                                           // si puede retroceder
        indiceActual = indiceActual - 1;                                 // resta uno al índice
        main("mostrar", null);                                           // vuelve a pintar la pregunta
        resultado = indiceActual;                                        // devuelve índice nuevo
      }
      break;
    }
    case "siguiente": {                                                  // ir a pregunta siguiente
      if (esUltimaPregunta(indiceActual, listaPreguntas.length)) {       // si está en la última
        main("resultados", null);                                        // muestra resultados finales
      } else {                                                           // si aún quedan preguntas
        indiceActual = indiceActual + 1;                                 // suma uno al índice
        main("mostrar", null);                                           // pinta la siguiente pregunta
      }
      break;
    }
    case "reiniciar": {                                                  // reiniciar todo el test
      borrarSession(CLAVE_SESSION);                                      // borra sessionStorage
      location.reload();                                                 // recarga la página
      break;
    }
    case "resultados": {                                                 // pantalla final del test
      let guardadas = leerSession(CLAVE_SESSION);                        // lee array guardado
      let datos = null;                                                  // variable para los datos finales

      if (guardadas) {                                                   // si hay datos en sessionStorage
        datos = parsearLista(guardadas);                                 // usa los datos guardados
      } else {                                                           // si no hay datos guardados
        datos = listaPreguntas;                                          // usa la lista en memoria
      }

      let html = construirHtmlResultados(datos);                         // genera html de resultados
      resultados.innerHTML = html;                                       // inserta html en pantalla
      vistaTest.classList.add("hidden");                                 // oculta el cuestionario
      vistaResultados.classList.remove("hidden");                        // muestra bloque resultados
      break;
    }
    default: {                                                           // operación no reconocida
      resultado = null;                                                  // mantiene resultado nulo
      break;
    }
  }

  return resultado;                                                      // devuelve resultado de la operación
};

const alCargarPagina = () => {                                           // manejador de carga de página
  main("arranque");                                                      // inicia el test
};

const alClicarAnterior = () => {                                         // manejador botón anterior
  main("anterior");                                                      // va a la pregunta anterior
};

const alClicarVerificar = () => {                                        // manejador botón verificar
  main("verificar");                                                     // corrige la pregunta actual
};

const alClicarSiguiente = () => {                                        // manejador botón siguiente
  main("siguiente");                                                     // avanza o muestra resultados
};

const alClicarReiniciar = () => {                                        // manejador botón reiniciar
  main("reiniciar");                                                     // borra datos y recarga
};

const alCambiarOpcion = (evento) => {                                    // manejador al elegir una opción
  main("elegir", evento.target.value);                                   // guarda la letra elegida
};

const enlazarEscuchadores = () => {                                      // registra todos los escuchadores
  document.addEventListener("DOMContentLoaded", alCargarPagina);         // arranque al cargar el html
  btnAnterior.addEventListener("click", alClicarAnterior);               // clic en pregunta anterior
  btnVerificar.addEventListener("click", alClicarVerificar);             // clic en verificar
  btnSiguiente.addEventListener("click", alClicarSiguiente);             // clic en pregunta siguiente
  btnReiniciar.addEventListener("click", alClicarReiniciar);             // clic en reiniciar test

  let j = 0;                                                             // contador para los radios
  while (j < radios.length) {                                            // recorre cada radio button
    radios[j].addEventListener("change", alCambiarOpcion);                // guarda opción al cambiar
    j = j + 1;                                                           // pasa al siguiente radio
  }
};

// EJECUCIÓN DE CÓDIGO

enlazarEscuchadores();                                                   // registra escuchadores y arranca
