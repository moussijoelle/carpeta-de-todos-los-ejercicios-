// Simula una base de datos en memoria con un array de objetos Libro
const baseDatosLibros = [ // Array donde se guardan todos los libros
    new Libro("978-0307474728", "Cien años de soledad","Gabriel García Márquez", 15, 19.99), // Libro de ejemplo 1
    new Libro("978-0399589430", "Breves respuestas a las grandes preguntas", "Stephen Hawking", 8, 14.50) // Libro de ejemplo 2
  ]
  
  console.table(baseDatosLibros); // Muestra la tabla de libros en la consola del navegador (F12)
