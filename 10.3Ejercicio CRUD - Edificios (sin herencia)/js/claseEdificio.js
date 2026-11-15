export class Edificio {
  #nombre;
  #plantas;
  #superficie;

  constructor(nombre, plantas, superficie) {
    this.#nombre = nombre;
    this.#plantas = plantas;
    this.#superficie = superficie;
  }

  getNombre() {
    return this.#nombre;
  }

  getPlantas() {
    return this.#plantas;
  }

  getSuperficie() {
    return this.#superficie;
  }

  setSuperficie(valor) {
    this.#superficie = valor;
  }

  limpiar() {
    const minSuperficie = this.#superficie / 5;
    let minPlantas = 0;

    if (this.#plantas > 1) {
      minPlantas = (this.#plantas - 1) * 0.5;
    } else {
      minPlantas = 0;
    }

    const minutos = minSuperficie + minPlantas;
    const costeDiario = minutos;
    const costeMensual = costeDiario * 30;

    return { minutos, costeDiario, costeMensual };
  }
}
