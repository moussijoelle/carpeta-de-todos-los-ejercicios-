class Imagen { // molde de cada slide del carrusel (ficha Imagen de la profe)
  constructor(imagen, nombre, title, descripcion, puesto, episodios, parrafoExtra, fuenteUrl, fuenteTexto) { // parámetros que recibe cada slide
    this.imagen = imagen; // ruta de la foto ("" si no hay imagen)
    this.nombre = nombre; // título principal del slide
    this.title = title; // estilo del anime, "Info", o "" en portada
    this.descripcion = descripcion; // texto descriptivo
    this.puesto = puesto || ""; // ej. "Anime 1" (vacío si no aplica)
    this.episodios = episodios !== undefined ? episodios : null; // número o texto de episodios
    this.parrafoExtra = parrafoExtra || ""; // párrafo largo del slide info
    this.fuenteUrl = fuenteUrl || ""; // URL del enlace Wikipedia
    this.fuenteTexto = fuenteTexto || ""; // texto visible del enlace
  }

  esIntro() { // ¿es la portada inicial?
    let esPortada = false; // resultado por defecto

    if (this.imagen === "" && this.title === "" && this.parrafoExtra === "") { // sin foto, sin estilo, sin extra
      esPortada = true; // cumple condiciones de portada
    }

    return esPortada; // devuelve true o false
  }

  esInfo() { // ¿es la página final de información?
    let esPaginaInfo = false; // resultado por defecto

    if (this.imagen === "" && this.title === "Info") { // sin foto y title = "Info"
      esPaginaInfo = true; // cumple condiciones de info
    }

    return esPaginaInfo; // devuelve true o false
  }

  toString() { // convierte el slide a HTML (como Alumno en clase)
    let html = ""; // cadena que se construirá

    html = "<b>" + this.nombre + "</b>"; // nombre en negrita
    if (this.title !== "") { // si hay estilo o subtítulo
      html = html + " — " + this.title; // lo añade separado por guión
    }
    html = html + "<br>" + this.descripcion; // salto de línea y descripción

    return html; // devuelve el HTML generado
  }
}
