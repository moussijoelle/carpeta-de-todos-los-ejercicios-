// IMPORTACIÓN DE MÓDULOS
import { Edificio } from './claseEdificio.js';

// DECLARACIÓN DE FUNCIONES

export const buscar = (lista, nombre) => {
  let encontrado = false;
  let indice = -1;
  let i = 0;
  const elementos = lista.length;

  while (i < elementos && !encontrado) {
    if (nombre === lista[i].getNombre()) {
      indice = i;
      encontrado = true;
    }
    i++;
  }

  return indice;
};

export const agregarEdificio = (lista, nombre, plantas, superficie) => {
  const indice = buscar(lista, nombre);
  let mensaje = '';

  if (indice !== -1) {
    mensaje = `El edificio "${nombre}" ya existe.`;
  } else {
    const nuevo = new Edificio(nombre, plantas, superficie);
    lista.push(nuevo);
    mensaje = `Edificio "${nombre}" agregado correctamente.`;
  }

  return mensaje;
};

export const devolverEdificio = (lista, nombre) => {
  const indice = buscar(lista, nombre);
  let mensaje = '';

  if (indice === -1) {
    mensaje = `No existe el edificio "${nombre}".`;
  } else {
    const ed = lista[indice];
    const info = ed.limpiar();

    mensaje = `Nombre: ${ed.getNombre()}
Plantas: ${ed.getPlantas()}
Superficie: ${ed.getSuperficie()} m²
Tiempo limpieza: ${info.minutos} min/día
Coste diario: ${info.costeDiario} €
Coste mensual: ${info.costeMensual} €`;
  }

  return mensaje;
};

export const modificarSuperficie = (lista, nombre, nuevaSuperficie) => {
  const indice = buscar(lista, nombre);
  let mensaje = '';

  if (indice === -1) {
    mensaje = `No existe el edificio "${nombre}".`;
  } else {
    lista[indice].setSuperficie(nuevaSuperficie);
    mensaje = `Superficie de "${nombre}" actualizada a ${nuevaSuperficie} m².`;
  }

  return mensaje;
};

export const eliminarEdificio = (lista, nombre) => {
  const indice = buscar(lista, nombre);
  let mensaje = '';

  if (indice === -1) {
    mensaje = `No existe el edificio "${nombre}".`;
  } else {
    lista.splice(indice, 1);
    mensaje = `Edificio "${nombre}" eliminado correctamente.`;
  }

  return mensaje;
};

export const listarEdificios = (lista) => {
  let texto = '';
  let i = 0;

  while (i < lista.length) {
    const ed = lista[i];
    const info = ed.limpiar();
    texto += `${i + 1}. ${ed.getNombre()} | ${ed.getPlantas()} plantas | ${ed.getSuperficie()} m² | ${info.costeMensual} €/mes\n`;
    i++;
  }

  return texto;
};

export const costeMensualTotal = (lista) => {
  let total = 0;
  let i = 0;

  while (i < lista.length) {
    total += lista[i].limpiar().costeMensual;
    i++;
  }

  return total;
};
