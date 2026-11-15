// IMPORTACIÓN DE MÓDULOS — claseImagen.js, datos.js, crud.js y carrousel.js cargados antes en admin.html

// DECLARACIÓN DE VARIABLES

const inputCrudNombreAdmin = document.getElementById("crud-nombre");  // nombre del anime
const btnDevolver = document.getElementById("btn-devolver");  // botón devolver
const btnModificar = document.getElementById("btn-modificar");  // botón modificar
const btnEliminar = document.getElementById("btn-eliminar");  // botón eliminar
const btnBuscarAdmin = document.getElementById("btn-buscar");  // botón buscar
const btnAgregarAdmin = document.getElementById("btn-agregar");  // botón agregar

let adminIniciado = false;                             // evita enlazar escuchadores dos veces

// DECLARACIÓN DE FUNCIONES

const validarPanelAdmin = (domListo, yaIniciado) => {  // comprueba si puede arrancar el panel admin
  let listo = false;                                   // por defecto no

  if (domListo && !yaIniciado) {                       // DOM listo y no iniciado antes
    listo = true;                                      // puede arrancar
  } else {                                             // no listo o ya iniciado
    listo = false;                                     // no puede arrancar
  }

  return listo;                                        // devuelve true o false
}

const leerNombreAdmin = (inputNombre) => {             // lee el nombre del formulario admin
  let nombre = "";                                     // valor por defecto

  if (inputNombre) {                                   // si existe el input
    nombre = inputNombre.value;                        // lee el valor
  } else {                                             // sin input en el DOM
    nombre = "";                                       // nombre vacío
  }

  return nombre;                                       // devuelve el nombre
}

// FUNCIÓN MAIN ADMIN — lee, valida, llama a main del carrusel, recibe return y muestra

const mainAdmin = (accion) => {                        // función principal del panel admin
  let nombre = leerNombreAdmin(inputCrudNombreAdmin);  // lee nombre del formulario

  switch (accion) {                                    // según acción del botón
    case "devolver":                                   // leer anime
      main("devolver", nombre);                        // delega en main del carrusel
      break;
    case "modificar":                                  // modificar anime
      main("modificar");                               // main lee el formulario completo
      break;
    case "eliminar":                                   // eliminar anime
      main("eliminar", nombre);                        // delega en main del carrusel
      break;
    case "buscar":                                     // buscar anime
      main("buscar", nombre);                          // delega en main del carrusel
      break;
    case "agregar":                                    // agregar anime
      main("agregar");                                 // delega en main del carrusel
      break;
    case "arranque": {                                 // inicio del panel admin
      let domListo = false;                            // flag DOM

      if (btnDevolver || btnModificar || btnEliminar) {  // hay botones admin
        domListo = true;                               // DOM disponible
      } else {                                         // faltan botones admin
        domListo = false;                              // DOM no disponible
      }

      let listo = validarPanelAdmin(domListo, adminIniciado);  // valida arranque

      if (listo) {                                     // si pasó validación
        adminIniciado = true;                          // marca como iniciado

        if (btnDevolver) {
          btnDevolver.addEventListener("click", () => mainAdmin("devolver"));  // devolver
        }
        if (btnModificar) {
          btnModificar.addEventListener("click", () => mainAdmin("modificar"));  // modificar
        }
        if (btnEliminar) {
          btnEliminar.addEventListener("click", () => mainAdmin("eliminar"));  // eliminar
        }
        if (btnBuscarAdmin) {
          btnBuscarAdmin.addEventListener("click", () => mainAdmin("buscar"));  // buscar
        }
        if (btnAgregarAdmin) {
          btnAgregarAdmin.addEventListener("click", () => mainAdmin("agregar"));  // agregar
        }
      }
      break;
    }
  }
}

// EJECUCIÓN DE CÓDIGO

document.addEventListener("DOMContentLoaded", () => mainAdmin("arranque"));  // arranca panel admin
