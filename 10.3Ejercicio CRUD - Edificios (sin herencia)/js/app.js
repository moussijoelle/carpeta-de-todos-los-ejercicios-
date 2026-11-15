// IMPORTACIÓN DE MÓDULOS
import { edificios } from './edificios.js';
import {
  buscar,
  agregarEdificio,
  devolverEdificio,
  modificarSuperficie,
  eliminarEdificio,
  listarEdificios,
  costeMensualTotal,
} from './crud.js';
import {
  mostrarCarrusel,
  obtenerIndiceCarrusel,
  mainPrimero,
  mainAnterior,
  mainSiguiente,
  mainUltimo,
} from './carrusel.js';

// DECLARACIÓN DE VARIABLES
const formEdificios = document.getElementById('form-edificios');
const inputNombre = document.getElementById('input-nombre');
const inputPlantas = document.getElementById('input-plantas');
const inputSuperficie = document.getElementById('input-superficie');
const dialogResultado = document.getElementById('dialog-resultado');
const dialogMensaje = document.getElementById('dialog-mensaje');
const salida = document.getElementById('salida');
const botonesOperacion = document.querySelectorAll('.btn-operacion');

let operacion = 0;

// DECLARACIÓN DE FUNCIONES

const mostrarDialogo = (mensaje) => {
  salida.textContent = mensaje;
  dialogMensaje.textContent = mensaje;
  dialogResultado.showModal();
};

const cerrarDialogo = () => {
  dialogResultado.close();
};

const mainAgregar = () => {
  const nombre = inputNombre.value.trim();
  const plantas = Number(inputPlantas.value);
  const superficie = Number(inputSuperficie.value);

  if (nombre === '') {
    mostrarDialogo('El nombre no puede estar vacío.');
  } else if (plantas < 1) {
    mostrarDialogo('Las plantas deben ser al menos 1.');
  } else if (superficie <= 0) {
    mostrarDialogo('La superficie debe ser mayor que 0.');
  } else {
    const resultado = agregarEdificio(edificios, nombre, plantas, superficie);
    mostrarDialogo(resultado);
    mostrarCarrusel(edificios.length - 1);
  }
};

const mainDevolver = () => {
  const nombre = inputNombre.value.trim();

  if (nombre === '') {
    mostrarDialogo('Escribe el nombre del edificio.');
  } else {
    const resultado = devolverEdificio(edificios, nombre);
    mostrarDialogo(resultado);
    const indice = buscar(edificios, nombre);

    if (indice !== -1) {
      mostrarCarrusel(indice);
    }
  }
};

const mainModificar = () => {
  const nombre = inputNombre.value.trim();
  const nuevaSuperficie = Number(inputSuperficie.value);

  if (nombre === '') {
    mostrarDialogo('Escribe el nombre del edificio.');
  } else if (nuevaSuperficie <= 0) {
    mostrarDialogo('La nueva superficie debe ser mayor que 0.');
  } else {
    const resultado = modificarSuperficie(edificios, nombre, nuevaSuperficie);
    mostrarDialogo(resultado);
    const indice = buscar(edificios, nombre);

    if (indice !== -1) {
      mostrarCarrusel(indice);
    }
  }
};

const mainEliminar = () => {
  const nombre = inputNombre.value.trim();

  if (nombre === '') {
    mostrarDialogo('Escribe el nombre del edificio.');
  } else {
    const indiceBorrado = buscar(edificios, nombre);
    const resultado = eliminarEdificio(edificios, nombre);
    mostrarDialogo(resultado);
    const indiceCarrusel = obtenerIndiceCarrusel();

    if (indiceBorrado === -1) {
      mostrarCarrusel(indiceCarrusel);
    } else if (edificios.length === 0) {
      mostrarCarrusel(0);
    } else {
      let nuevoIndice = indiceCarrusel;

      if (indiceBorrado < indiceCarrusel) {
        nuevoIndice = indiceCarrusel - 1;
      } else if (indiceCarrusel >= edificios.length) {
        nuevoIndice = edificios.length - 1;
      }

      mostrarCarrusel(nuevoIndice);
    }
  }
};

const mainListar = () => {
  if (edificios.length === 0) {
    mostrarDialogo('No hay edificios en la lista.');
  } else {
    const resultado = listarEdificios(edificios);
    mostrarDialogo(resultado);
  }
};

const mainCosteTotal = () => {
  if (edificios.length === 0) {
    mostrarDialogo('No hay edificios para calcular el coste.');
  } else {
    const total = costeMensualTotal(edificios);
    mostrarDialogo(`Coste mensual total de limpieza: ${total} €`);
  }
};

const marcarOperacion = (numero) => {
  operacion = numero;

  botonesOperacion.forEach((boton) => {
    boton.classList.remove('ring-4', 'ring-offset-2', 'ring-white');
  });

  const botonActivo = document.querySelector(`[data-operacion="${numero}"]`);

  if (botonActivo) {
    botonActivo.classList.add('ring-4', 'ring-offset-2', 'ring-white');
  }
};

const mainAceptar = () => {
  if (operacion === 1) {
    mainAgregar();
  } else if (operacion === 2) {
    mainModificar();
  } else if (operacion === 3) {
    mainEliminar();
  } else if (operacion === 4) {
    mainDevolver();
  } else {
    mostrarDialogo('Elige una operación: Agregar, Modificar, Eliminar o Mostrar.');
  }
};

const mainLimpiarDatos = () => {
  formEdificios.reset();
};

// EJECUCIÓN DE CÓDIGO
document.getElementById('btn-first').addEventListener('click', mainPrimero);
document.getElementById('btn-prev').addEventListener('click', mainAnterior);
document.getElementById('btn-next').addEventListener('click', mainSiguiente);
document.getElementById('btn-last').addEventListener('click', mainUltimo);

document.getElementById('btn-agregar').addEventListener('click', () => marcarOperacion(1));
document.getElementById('btn-modificar').addEventListener('click', () => marcarOperacion(2));
document.getElementById('btn-eliminar').addEventListener('click', () => marcarOperacion(3));
document.getElementById('btn-mostrar').addEventListener('click', () => marcarOperacion(4));
document.getElementById('btn-aceptar').addEventListener('click', mainAceptar);
document.getElementById('btn-limpiar').addEventListener('click', mainLimpiarDatos);
document.getElementById('btn-listar').addEventListener('click', mainListar);
document.getElementById('btn-coste-total').addEventListener('click', mainCosteTotal);

formEdificios.addEventListener('submit', (evento) => {
  evento.preventDefault();
  mainAceptar();
});

document.getElementById('btn-cerrar-dialogo').addEventListener('click', cerrarDialogo);
document.getElementById('btn-cerrar-dialogo-footer').addEventListener('click', cerrarDialogo);

