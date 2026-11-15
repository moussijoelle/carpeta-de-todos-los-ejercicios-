class Libro { // Define la plantilla para crear objetos libro
    #isbn;    // Campo privado: código único del libro
    #titulo;  // Campo privado: nombre del libro
    #autor;   // Campo privado: quién lo escribió
    #stock;   // Campo privado: unidades disponibles
    #precio;  // Campo privado: precio en euros
  
    constructor(isbn, titulo, autor, stock, precio) { // Se ejecuta al crear un new Libro(...)
      this.#isbn = isbn.trim();   // Guarda el ISBN sin espacios al inicio/final
      this.#titulo = titulo;      // Asigna el título recibido
      this.#autor = autor;        // Asigna el autor recibido
      this.#stock = stock;        // Asigna las unidades en stock
      this.#precio = precio;      // Asigna el precio del libro
    }
  
    getIsbn() { return this.#isbn; }     // Devuelve el ISBN (lectura desde fuera)
    getTitulo() { return this.#titulo; } // Devuelve el título
    getAutor() { return this.#autor; }   // Devuelve el autor
    getStock() { return this.#stock; }   // Devuelve el stock
    getPrecio() { return this.#precio; } // Devuelve el precio
  
    actualizarStockYPrecio(nuevoStock, nuevoPrecio) { // Única forma de cambiar stock y precio
      this.#stock = parseInt(nuevoStock);       // Convierte a entero y actualiza stock
      this.#precio = parseFloat(nuevoPrecio);   // Convierte a decimal y actualiza precio
    }
  
    toString() { // Convierte el libro en un texto legible
      let msg = `ISBN: ${this.#isbn} | Título: ${this.#titulo} | Precio: €${this.#precio}`; // Arma el mensaje
      return msg // Devuelve el texto formateado
    }
  
  }
