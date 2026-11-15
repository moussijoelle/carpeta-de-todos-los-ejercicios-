class Pregunta {
  constructor(texto, opciones, opcionCorrecta, puntosPregunta, justificacion) {
    this.texto = texto;
    this.opciones = opciones;
    this.opcionCorrecta = opcionCorrecta;
    this.opcionSeleccionada = null;
    this.puntosPregunta = puntosPregunta;
    this.puntosAsignados = 0;
    this.justificacion = justificacion;
  }
}
