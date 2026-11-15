// IMPORTACIÓN DE MÓDULOS
// Sin módulos en este ejercicio

// MAPEO DEL DOM

const inputProducto = document.getElementById("producto-input");           // campo nombre del producto
const inputCantidad = document.getElementById("cantidad-input");           // campo cantidad a comprar
const inputPrecio = document.getElementById("precio-input");               // campo precio estimado
const btnAgregar = document.getElementById("btn-agregar");                 // botón agregar producto
const btnVaciar = document.getElementById("btn-vaciar");                   // botón vaciar carrito
const btnCalcular = document.getElementById("btn-calcular");               // botón calcular total
const btnTema = document.getElementById("btn-tema");                       // botón cambiar tema
const iconoSol = document.getElementById("icono-sol");                     // icono modo claro
const iconoLuna = document.getElementById("icono-luna");                   // icono modo oscuro
const listaComprasElemento = document.getElementById("lista-compras");     // lista ordenada en pantalla
const mensajeElemento = document.getElementById("mensaje");                // párrafo de avisos al usuario
const numProdElemento = document.getElementById("num-prod");               // contador de productos
const totalEstimadoElemento = document.getElementById("total-estimado");   // total estimado en el panel

// DECLARACIÓN DE VARIABLES

const CLAVE_STORAGE = "listaCompras";                                      // clave para guardar en localStorage
const CLAVE_TEMA = "tema";                                                 // clave para guardar el tema elegido
let listaCompras = [];                                                     // array de objetos de la lista

// DECLARACIÓN DE FUNCIONES

function crearProducto(nombre, cantidad, precio) {                         // crea un objeto producto
  let producto = {                                                           // objeto con tres propiedades
    producto: nombre,                                                        // nombre del artículo
    cantidad: cantidad,                                                      // unidades a comprar
    precio: precio                                                           // precio estimado unitario
  };
  return producto;                                                           // devuelve el objeto creado
}

function normalizarTexto(texto) {                                          // prepara texto para comparar
  let textoNormalizado = texto.trim().toLowerCase();                         // quita espacios y minúsculas
  return textoNormalizado;                                                   // devuelve el texto normalizado
}

function productoYaExiste(nombre) {                                        // comprueba si hay duplicado
  let nombreNormalizado = normalizarTexto(nombre);                           // normaliza el nombre recibido
  let existe = false;                                                        // resultado por defecto
  let indice = 0;                                                            // empieza en el primer elemento

  while (indice < listaCompras.length && existe === false) {                 // recorre la lista
    if (normalizarTexto(listaCompras[indice].producto) === nombreNormalizado) { // mismo producto
      existe = true;                                                         // marca que ya existe
    } else {                                                                 // producto distinto
      indice = indice + 1;                                                   // pasa al siguiente
    }
  }

  return existe;                                                             // devuelve true o false
}

function validarEntrada(nombre, cantidad, precio) {                        // valida los datos del formulario
  let resultado = {                                                          // objeto con el resultado
    valido: true,                                                            // empieza como válido
    mensaje: ""                                                              // sin mensaje de error
  };

  if (nombre.trim() === "") {                                                // producto vacío
    resultado.valido = false;                                                // marca como inválido
    resultado.mensaje = "Debes escribir un producto.";                       // mensaje para el usuario
  } else if (Number.isNaN(cantidad) || cantidad <= 0) {                      // cantidad incorrecta
    resultado.valido = false;                                                // marca como inválido
    resultado.mensaje = "La cantidad debe ser mayor que cero.";              // mensaje para el usuario
  } else if (Number.isNaN(precio) || precio < 0) {                           // precio incorrecto
    resultado.valido = false;                                                // marca como inválido
    resultado.mensaje = "El precio no puede ser negativo.";                  // mensaje para el usuario
  } else {                                                                   // todo correcto
    resultado.valido = true;                                                 // confirma que es válido
    resultado.mensaje = "";                                                  // sin mensaje de error
  }

  return resultado;                                                          // devuelve validación y mensaje
}

function guardarListaEnStorage() {                                         // guarda la lista en el navegador
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(listaCompras));         // convierte a texto y guarda
}

function cargarListaDesdeStorage() {                                         // lee la lista guardada
  let listaGuardada = localStorage.getItem(CLAVE_STORAGE);                   // obtiene el texto guardado
  let listaCargada = [];                                                     // array vacío por defecto

  if (listaGuardada !== null) {                                              // hay datos guardados
    listaCargada = JSON.parse(listaGuardada);                                // convierte texto a array
  } else {                                                                   // no hay nada guardado
    listaCargada = [];                                                       // empieza con lista vacía
  }

  return listaCargada;                                                       // devuelve el array cargado
}

function eliminarListaDelStorage() {                                       // borra la lista del navegador
  localStorage.removeItem(CLAVE_STORAGE);                                    // elimina la clave guardada
}

function agregarProductoALista(nombre, cantidad, precio) {                 // añade producto si es válido
  let validacion = validarEntrada(nombre, cantidad, precio);                 // comprueba los datos
  let respuesta = {                                                          // respuesta para la interfaz
    mensaje: "",                                                             // texto a mostrar
    limpiarFormulario: false                                                 // si vacía los inputs
  };

  if (validacion.valido === false) {                                         // datos incorrectos
    respuesta.mensaje = validacion.mensaje;                                  // muestra el error
    respuesta.limpiarFormulario = false;                                     // no limpia el formulario
  } else if (productoYaExiste(nombre) === true) {                            // producto repetido
    respuesta.mensaje = "Ese producto ya está en la lista.";                 // aviso de duplicado
    respuesta.limpiarFormulario = false;                                     // no limpia el formulario
  } else {                                                                   // producto nuevo válido
    let nuevoProducto = crearProducto(nombre.trim(), cantidad, precio);      // crea el objeto
    listaCompras.push(nuevoProducto);                                        // lo añade al array
    guardarListaEnStorage();                                                 // guarda en localStorage
    respuesta.mensaje = "Producto agregado correctamente.";                  // mensaje de éxito
    respuesta.limpiarFormulario = true;                                      // limpia el formulario
  }

  return respuesta;                                                          // devuelve mensaje y acción
}

function vaciarListaCompras() {                                            // vacía lista y almacenamiento
  listaCompras = [];                                                         // borra el array en memoria
  eliminarListaDelStorage();                                                 // borra del localStorage
  return "Lista vaciada.";                                                   // mensaje para el usuario
}

function calcularTotalEstimado() {                                         // suma cantidad por precio
  let total = 0;                                                             // acumulador del total
  let indice = 0;                                                            // empieza en el primer producto

  while (indice < listaCompras.length) {                                     // recorre todos los productos
    total = total + (listaCompras[indice].cantidad * listaCompras[indice].precio); // suma cada línea
    indice = indice + 1;                                                     // pasa al siguiente
  }

  return total;                                                              // devuelve el total calculado
}

function formatearMoneda(cantidad) {                                         // convierte número a texto con €
  let textoMoneda = cantidad.toFixed(2) + " €";                              // dos decimales y símbolo
  return textoMoneda;                                                        // devuelve el texto formateado
}

function construirTextoLista() {                                           // genera el html de la lista
  let htmlLista = "";                                                        // texto html vacío
  let indice = 0;                                                            // empieza en el primer producto

  while (indice < listaCompras.length) {                                     // recorre el array
    let item = listaCompras[indice];                                         // producto actual
    htmlLista = htmlLista +                                                  // concatena cada línea
      "<li>" +
      item.producto + " — " +
      item.cantidad + " uds — " +
      formatearMoneda(item.precio) +
      "</li>";
    indice = indice + 1;                                                     // pasa al siguiente
  }

  return htmlLista;                                                          // devuelve el html completo
}

function obtenerCantidadProductos() {                                      // cuenta productos en la lista
  let cantidad = listaCompras.length;                                        // longitud del array
  return cantidad;                                                           // devuelve el número
}

function actualizarIconoTema() {                                           // muestra sol o luna según el tema
  let esOscuro = document.documentElement.classList.contains("dark");        // comprueba si está en dark

  if (esOscuro === true) {                                                   // modo oscuro activo
    iconoSol.classList.add("hidden");                                        // oculta el sol
    iconoLuna.classList.remove("hidden");                                    // muestra la luna
  } else {                                                                   // modo claro activo
    iconoSol.classList.remove("hidden");                                     // muestra el sol
    iconoLuna.classList.add("hidden");                                       // oculta la luna
  }
}

function aplicarTemaGuardado() {                                           // lee el tema guardado al arrancar
  actualizarIconoTema();                                                   // ajusta los iconos del botón
}

function cambiarTema() {                                                   // alterna entre claro y oscuro
  document.documentElement.classList.toggle("dark");                         // enciende o apaga el modo dark

  if (document.documentElement.classList.contains("dark") === true) {        // quedó en oscuro
    localStorage.setItem(CLAVE_TEMA, "dark");                                // guarda preferencia oscura
  } else {                                                                   // quedó en claro
    localStorage.setItem(CLAVE_TEMA, "light");                               // guarda preferencia clara
  }

  actualizarIconoTema();                                                   // actualiza sol y luna
}

function enlazarEscuchadores() {                                             // registra todos los escuchadores
  btnAgregar.addEventListener("click", alClicarAgregar);                     // clic en agregar
  btnVaciar.addEventListener("click", alClicarVaciar);                       // clic en vaciar
  btnCalcular.addEventListener("click", alClicarCalcular);                   // clic en calcular
  btnTema.addEventListener("click", alClicarTema);                           // clic en cambiar tema
}

function alClicarAgregar() {                                               // manejador botón agregar
  main("agregar", null);                                                     // procesa nuevo producto
}

function alClicarVaciar() {                                                  // manejador botón vaciar
  main("vaciar", null);                                                      // vacía la lista
}

function alClicarCalcular() {                                              // manejador botón calcular
  main("calcular", null);                                                    // muestra total estimado
}

function alClicarTema() {                                                    // manejador botón tema
  cambiarTema();                                                             // alterna claro y oscuro
}

function main(operacion, entrada) {                                        // única función que toca el dom
  let resultado = null;                                                      // valor de retorno por defecto
  let mensaje = "";                                                          // texto para el usuario
  let limpiarFormulario = false;                                             // si vacía inputs
  let htmlLista = "";                                                        // html de la lista
  let cantidad = 0;                                                          // número de productos
  let totalTexto = "";                                                       // total formateado
  let textoMensaje = "";                                                     // texto del mensaje visible

  switch (operacion) {                                                       // según la operación recibida
    case "arranque": {                                                        // inicio de la aplicación
      listaCompras = cargarListaDesdeStorage();                              // carga lista guardada
      mensaje = "";                                                          // sin mensaje inicial
      limpiarFormulario = false;                                             // no limpia el formulario
      break;
    }
    case "agregar": {                                                          // añadir producto desde el formulario
      let nombre = inputProducto.value;                                      // lee el producto
      let cantidadLeida = Number(inputCantidad.value);                       // lee la cantidad
      let precioLeido = Number(inputPrecio.value);                           // lee el precio
      let respuesta = agregarProductoALista(nombre, cantidadLeida, precioLeido); // intenta añadir
      mensaje = respuesta.mensaje;                                           // mensaje de éxito o error
      limpiarFormulario = respuesta.limpiarFormulario;                       // limpia si procede
      break;
    }
    case "vaciar": {                                                           // vaciar carrito completo
      mensaje = vaciarListaCompras();                                        // vacía memoria y storage
      limpiarFormulario = false;                                             // mantiene los inputs
      break;
    }
    case "calcular": {                                                         // calcular total a gastar
      let total = calcularTotalEstimado();                                   // obtiene la suma
      mensaje = "Total estimado a gastar: " + formatearMoneda(total);        // prepara el texto
      limpiarFormulario = false;                                             // mantiene los inputs
      break;
    }
    default: {                                                                 // operación no reconocida
      mensaje = "";                                                          // sin mensaje
      limpiarFormulario = false;                                             // no limpia el formulario
      break;
    }
  }

  if (operacion === "arranque" || operacion === "agregar" || operacion === "vaciar" || operacion === "calcular") {
    htmlLista = construirTextoLista();                                       // html de la lista
    cantidad = obtenerCantidadProductos();                                   // número de productos
    totalTexto = formatearMoneda(calcularTotalEstimado());                   // total formateado

    if (limpiarFormulario === true) {                                        // hay que vaciar inputs
      inputProducto.value = "";                                            // borra el producto
      inputCantidad.value = "1";                                             // restablece cantidad
      inputPrecio.value = "";                                                // borra el precio
    } else {                                                                 // no se limpia el formulario
      // mantiene los valores escritos
    }

    if (mensaje.trim() === "") {                                             // sin mensaje que mostrar
      textoMensaje = "\u00A0";                                               // espacio invisible
      mensajeElemento.className = "italic text-slate-600 dark:text-slate-400 mt-4 min-h-[1.5rem]"; // estilo normal
      mensajeElemento.textContent = textoMensaje;                            // escribe el mensaje
    } else if (mensaje.indexOf("Total estimado a gastar") === 0) {             // mensaje del total
      mensajeElemento.className = "mt-4 min-h-[1.5rem] text-lg font-bold text-orange-600 dark:text-orange-400"; // estilo naranja
      mensajeElemento.textContent = mensaje;                                 // escribe el total
    } else {                                                                 // otro mensaje cualquiera
      textoMensaje = mensaje;                                                // guarda el texto
      mensajeElemento.className = "italic text-slate-600 dark:text-slate-400 mt-4 min-h-[1.5rem]"; // estilo normal
      mensajeElemento.textContent = textoMensaje;                            // escribe el mensaje
    }

    listaComprasElemento.innerHTML = htmlLista;                              // pinta la lista
    numProdElemento.textContent = String(cantidad);                          // actualiza el contador
    totalEstimadoElemento.textContent = totalTexto;                          // actualiza el total
  }

  return resultado;                                                          // devuelve resultado de la operación
}

// EJECUCIÓN DE CÓDIGO

enlazarEscuchadores();                                                       // registra escuchadores
aplicarTemaGuardado();                                                      // ajusta iconos del tema
main("arranque", null);                                                      // inicia la aplicación
