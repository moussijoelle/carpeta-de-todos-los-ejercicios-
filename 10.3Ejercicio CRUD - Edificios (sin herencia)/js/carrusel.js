// IMPORTACIÓN DE MÓDULOS
import { edificios, FOTOS } from './edificios.js';

// DECLARACIÓN DE VARIABLES
let indiceCarrusel = 0;

const carouselImagen = document.getElementById('carousel-imagen');
const carouselNombre = document.getElementById('carousel-nombre');
const carouselPlantas = document.getElementById('carousel-plantas');
const carouselSuperficie = document.getElementById('carousel-superficie');
const carouselCoste = document.getElementById('carousel-coste');
const carouselIndice = document.getElementById('carousel-indice');

// DECLARACIÓN DE FUNCIONES

const fotoCarrusel = (indice) => {
  let ruta = '';

  if (indice < FOTOS.length) {
    ruta = FOTOS[indice];
  } else {
    ruta = FOTOS[FOTOS.length - 1];
  }

  return ruta;
};

const limitarIndice = (indice, total) => {
  let resultado = indice;

  if (total === 0) {
    resultado = 0;
  } else if (indice < 0) {
    resultado = 0;
  } else if (indice >= total) {
    resultado = total - 1;
  } else {
    resultado = indice;
  }

  return resultado;
};

export const obtenerIndiceCarrusel = () => {
  return indiceCarrusel;
};

export const mostrarCarrusel = (indice) => {
  const total = edificios.length;
  indiceCarrusel = limitarIndice(indice, total);

  if (total === 0) {
    carouselImagen.src = FOTOS[0];
    carouselNombre.textContent = 'Sin edificios';
    carouselPlantas.textContent = 'Plantas: —';
    carouselSuperficie.textContent = 'Superficie: —';
    carouselCoste.textContent = 'Coste mensual: —';
    carouselIndice.textContent = '0 / 0';
  } else {
    const ed = edificios[indiceCarrusel];
    const info = ed.limpiar();

    carouselImagen.src = fotoCarrusel(indiceCarrusel);
    carouselIndice.textContent = `${indiceCarrusel + 1} / ${total}`;
    carouselNombre.textContent = ed.getNombre();
    carouselPlantas.textContent = `Plantas: ${ed.getPlantas()}`;
    carouselSuperficie.textContent = `Superficie: ${ed.getSuperficie()} m²`;
    carouselCoste.textContent = `Coste mensual: ${info.costeMensual} €`;
  }
};

export const mainPrimero = () => {
  mostrarCarrusel(0);
};

export const mainAnterior = () => {
  const total = edificios.length;

  if (total === 0) {
    mostrarCarrusel(0);
  } else if (indiceCarrusel === 0) {
    mostrarCarrusel(total - 1);
  } else {
    mostrarCarrusel(indiceCarrusel - 1);
  }
};

export const mainSiguiente = () => {
  const total = edificios.length;

  if (total === 0) {
    mostrarCarrusel(0);
  } else if (indiceCarrusel === total - 1) {
    mostrarCarrusel(0);
  } else {
    mostrarCarrusel(indiceCarrusel + 1);
  }
};

export const mainUltimo = () => {
  if (edificios.length === 0) {
    mostrarCarrusel(0);
  } else {
    mostrarCarrusel(edificios.length - 1);
  }
};

// EJECUCIÓN DE CÓDIGO
mostrarCarrusel(0);
