class Libro {
    #isbn;
    #titulo;
    #autor;
    #stock;
    #precio;
  
    constructor(isbn, titulo, autor, stock, precio) {
      this.#isbn = isbn.trim();
      this.#titulo = titulo;
      this.#autor = autor;
      this.#stock = stock;
      this.#precio = precio;
    }
  
    getIsbn() { return this.#isbn; }
    getTitulo() { return this.#titulo; }
    getAutor() { return this.#autor; }
    getStock() { return this.#stock; }
    getPrecio() { return this.#precio; }
  
    //La única forma de actualizar campos privados es con métodos
  
    actualizarStockYPrecio(nuevoStock, nuevoPrecio) {
      this.#stock = parseInt(nuevoStock);
      this.#precio = parseFloat(nuevoPrecio);
    }
  
    toString() {
      let msg = `ISBN: ${this.#isbn} | Título: ${this.#titulo} | Precio: €${this.#precio}`;
      return msg
    }
  
  }