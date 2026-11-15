// IMPORTACIÓN DE MÓDULOS
import { Edificio } from './claseEdificio.js';

// DECLARACIÓN DE VARIABLES
export const RUTA_FOTOS = 'img/';

export const FOTOS = [
  'img/edificio1.jpg',
  'img/edificio2.jpg',
  'img/edificio3.jpg',
  'img/edificio4.jpg',
  'img/edifcio5.jpg',
];

export let edificios = [
  new Edificio('Residencial Horizonte', 14, 2100),
  new Edificio('Pirámide del Sol', 12, 960),
  new Edificio('Centro Ondas', 3, 380),
  new Edificio('Torre Circular', 6, 720),
  new Edificio('Torre Cristal', 52, 4800),
];
