// --- VARIABLES GLOBALES DE ESTADO ---
let operacionActual = null; // Guarda el modo activo: 1 agregar, 2 modificar, 3 eliminar, 4 mostrar
let libroEncontrado = null;  // Reservado para guardar el libro encontrado (no se usa aún)
let posicionLibro = -1; // Índice del libro en el array; -1 significa que no se encontró

// --- MAPEO DEL DOM ---
const btnAgregar = document.getElementById('btn-agregar'); // Botón 1. AGREGAR del menú
const btnModificar = document.getElementById('btn-modificar'); // Botón 2. MODIFICAR del menú
const btnEliminar = document.getElementById('btn-eliminar'); // Botón 3. ELIMINAR del menú
const btnMostrar = document.getElementById('btn-mostrar'); // Botón 4. MOSTRAR del menú

const estadoOperacion = document.getElementById('estado-operacion'); // Texto que indica el modo actual
const formLibro = document.getElementById('form-libro'); // Formulario completo del libro
const inputIsbn = document.getElementById('isbn'); // Campo de entrada del ISBN
const fieldsetCampos = document.getElementById('campos-libro'); // Grupo título, autor, stock y precio
const btnCancelarForm = document.getElementById('btn-cancelar'); // Botón para salir del modo actual
const btnConfirmar = document.getElementById('btn-confirmar'); // Botón Guardar Cambios del formulario
const btnReset = document.getElementById('btn-reset'); // Botón para limpiar campos sin salir del modo

const ocultarAccionesFormulario = () => { // Esconde Cancelar y Guardar
  btnCancelarForm.classList.add('hidden'); // Añade clase hidden a Cancelar
  btnConfirmar.classList.add('hidden'); // Añade clase hidden a Guardar
};

const mostrarAccionesFormulario = () => { // Muestra Cancelar y Guardar
  btnCancelarForm.classList.remove('hidden'); // Quita hidden de Cancelar
  btnConfirmar.classList.remove('hidden'); // Quita hidden de Guardar
};

// Elementos del Dialog/Modal
const dialogInformativo = document.getElementById('dialog-informativo'); // Ventana emergente de avisos
const dialogBtnAceptar = document.getElementById('info-btn-aceptar'); // Botón Ok del diálogo
const dialogBtnCancelar = document.getElementById('dialog-btn-cancelar'); // Referencia a Cancelar (no existe en HTML)

// FUNCIONES

dialogBtnAceptar.addEventListener('click', () => { // Al pulsar Ok en el diálogo
  dialogInformativo.close(); // Cierra la ventana emergente
});

const mostrarAviso = (titulo, mensaje) => { // Función reutilizable para mostrar avisos
  document.getElementById('info-titulo').textContent = titulo; // Cambia el título del diálogo
  document.getElementById('info-mensaje').textContent = mensaje; // Cambia el mensaje del diálogo
  dialogInformativo.showModal(); // Abre el diálogo bloqueando el resto de la página
}

const gestionarPermisosCampos = (operacion) => { // Decide qué campos se pueden editar
  const campos = document.querySelectorAll('#campos-libro input'); // Selecciona todos los inputs del fieldset

  if (operacion >= 3) { // Si es eliminar (3) o mostrar (4)
    fieldsetCampos.disabled = true; // Bloquea todo el grupo de campos
  } else { // Si es agregar (1) o modificar (2)
    fieldsetCampos.disabled = false; // Habilita el fieldset

    campos.forEach(input => { // Recorre cada input del fieldset
      const infoAtr = input.getAttribute('data-info'); // Lee si es "fijo" o "modificable"

      if (infoAtr !== 'modificable' && operacion === 2) { // En modificar, título y autor no se tocan
        input.disabled = true;  // Bloquea título y autor
      } else { // En agregar o campos modificables de modificar
        input.disabled = false; // Permite escribir en ese campo
      }
    });
  }
}

//-----------------------------------------------------

const resetearFormulario = () => { // Vuelve todo al estado inicial
  formLibro.reset(); // Vacía todos los inputs del formulario
  fieldsetCampos.disabled = true; // Bloquea título, autor, stock y precio
  inputIsbn.disabled = true; // Bloquea el campo ISBN
  ocultarAccionesFormulario(); // Esconde Cancelar y Guardar
  estadoOperacion.textContent = "Selecciona una operación en el menú superior"; // Restaura el mensaje inicial
}
btnCancelarForm.addEventListener('click', resetearFormulario); // Cancelar ejecuta el reset completo

const limpiarCampos = () => { // Limpia campos pero mantiene el modo activo
  formLibro.reset(); // Vacía los inputs
  fieldsetCampos.disabled = true; // Vuelve a bloquear los campos del libro
  ocultarAccionesFormulario(); // Esconde Cancelar y Guardar
  posicionLibro = -1; // Marca que no hay libro seleccionado

  if (operacionActual !== null) { // Si hay un modo activo (agregar, modificar, etc.)
    inputIsbn.disabled = false; // Deja escribir el ISBN otra vez
    inputIsbn.focus(); // Pone el cursor en el ISBN
  }
};
btnReset.addEventListener('click', limpiarCampos); // Reset ejecuta limpiarCampos

//-----------------------------------------------------

const buscarLibroPorIsbn = (isbnValue) => { // Busca un ISBN en el array baseDatosLibros

  let encontrado = false; // Bandera: aún no hemos encontrado el libro
	let indice = -1;  // Posición por defecto si no existe
	let i = 0; // Contador del bucle while
	let elementos = baseDatosLibros.length // Cantidad total de libros en el array
	
	while (i < elementos && !encontrado) { // Recorre mientras queden libros y no se haya encontrado
		if (isbnValue === baseDatosLibros[i].getIsbn()) { // Compara el ISBN buscado con el del array
			indice = i; // Guarda la posición donde está
			encontrado = true; // Marca que ya lo encontramos
		}
	  i++; // Pasa al siguiente libro
  }

	posicionLibro = indice; // Guarda el resultado en la variable global

  console.log(`buscarLibroPorIsbn(${isbnValue})`, 'posicionLibro', posicionLibro); // Depuración en consola
  if (posicionLibro >= 0) { // Si el índice es 0 o mayor, el libro existe
    mostrarAviso('Libro encontrado', 'Presiona OK para mostrarlo en pantalla') // Aviso de éxito en búsqueda
  } else { // Si posicionLibro sigue siendo -1
    if (operacionActual > 1) { // En modificar, eliminar o mostrar hace falta que exista
      mostrarAviso('Libro no encontrado', 'No se puede realizar la operación') // Aviso de error
    }
  }
}

//-----------------------------------------------------

const mostrarLibroEnFormulario = () => { // Rellena el formulario con datos del libro encontrado
  const libro = baseDatosLibros[posicionLibro]; // Obtiene el objeto Libro del array

  document.getElementById('titulo').value = libro.getTitulo(); // Escribe el título en el input
  document.getElementById('autor').value = libro.getAutor(); // Escribe el autor
  document.getElementById('stock').value = libro.getStock(); // Escribe el stock
  document.getElementById('precio').value = libro.getPrecio(); // Escribe el precio

}

const guardarLibroEnFormulario = () => { // Crea un libro nuevo y lo añade al array
  let isbn = document.getElementById('isbn').value; // Lee ISBN del formulario
  let titulo = document.getElementById('titulo').value; // Lee título
  let autor = document.getElementById('autor').value; // Lee autor
  let stock = parseInt(document.getElementById('stock').value); // Lee stock como número entero
  let precio = parseFloat(document.getElementById('precio').value); // Lee precio como decimal

  const nuevoLibro = new Libro(isbn, titulo, autor, stock, precio); // Crea el objeto Libro
  baseDatosLibros.push(nuevoLibro); // Añade el libro al final del array
  console.clear(); // Limpia la consola
  console.table(baseDatosLibros); // Muestra la lista actualizada
  mostrarAviso("Éxito", "El libro ha sido registrado correctamente."); // Diálogo de confirmación

}

const modificarLibroEnFormulario = () => { // Actualiza stock y precio de un libro existente
    const libro = baseDatosLibros[posicionLibro]; // Obtiene el libro a modificar
    let stock = parseInt(document.getElementById('stock').value); // Lee el nuevo stock
    let precio = parseFloat(document.getElementById('precio').value); // Lee el nuevo precio
    libro.actualizarStockYPrecio(stock, precio) // Llama al método de la clase Libro
    console.clear(); // Limpia la consola
    console.log(baseDatosLibros[posicionLibro]); // Muestra el libro modificado
    mostrarAviso("Éxito", "Se han actualizado los datos de Stock y Precio."); // Diálogo de confirmación
}

const eliminarLibroEnFormulario = () => { // Borra un libro del array
    baseDatosLibros.splice(posicionLibro,1); // Elimina 1 elemento en la posición encontrada
    mostrarAviso("Éxito", "Se ha eliminado el libro."); // Diálogo de confirmación
}

const gestionarInputISBN = (e) => { // Se ejecuta al pulsar teclas en el campo ISBN
  if (e.key === 'Enter') { // Solo actúa cuando se pulsa Enter
    e.preventDefault(); // Evita que el formulario se envíe solo

    const isbnValue = inputIsbn.value.trim(); // Lee el ISBN sin espacios extra
    if (isbnValue !== '') { // Si el ISBN no está vacío
        buscarLibroPorIsbn(isbnValue); // Busca el libro en el array
        if (posicionLibro >= 0) { // Si lo encontró
          mostrarLibroEnFormulario(); // Rellena el formulario con sus datos
        }

        if (operacionActual === 1 && posicionLibro < 0) { // Agregar con ISBN nuevo (no existe)
            gestionarPermisosCampos(1); // Habilita todos los campos para crear libro
            mostrarAccionesFormulario(); // Muestra Cancelar y Guardar
        } else { // Resto de casos: modificar, eliminar, mostrar o ISBN existente
          gestionarPermisosCampos(operacionActual); // Aplica permisos según el modo
          mostrarAccionesFormulario(); // Muestra Cancelar y Guardar
        }
    }
  }
}

inputIsbn.addEventListener('keydown', gestionarInputISBN); // Escucha teclas en el campo ISBN

//-----------------------------------------------------

const agregar = () => { // Activa el modo 1. AGREGAR
  operacionActual = 1; // Guarda que estamos en modo agregar
  resetearFormulario(); // Limpia la pantalla
  inputIsbn.disabled = false; // Permite escribir el ISBN
  inputIsbn.focus(); // Pone el cursor en el ISBN
  estadoOperacion.textContent = "MODO: 1. AGREGAR LIBRO"; // Actualiza el mensaje visible
}
btnAgregar.addEventListener('click', agregar); // Enlaza el botón con la función agregar

//-----------------------------------------------------

const modificar = () => { // Activa el modo 2. MODIFICAR
  operacionActual = 2; // Guarda que estamos en modo modificar
  resetearFormulario(); // Limpia la pantalla
  inputIsbn.disabled = false; // Permite escribir el ISBN
  inputIsbn.focus(); // Pone el cursor en el ISBN
  estadoOperacion.textContent = "MODO: 2. MODIFICANDO STOCK Y PRECIO"; // Actualiza el mensaje
}
btnModificar.addEventListener('click', modificar); // Enlaza el botón con la función modificar

//-----------------------------------------------------

const eliminar = () => { // Activa el modo 3. ELIMINAR
  operacionActual = 3; // Guarda que estamos en modo eliminar
  resetearFormulario(); // Limpia la pantalla
  inputIsbn.disabled = false; // Permite escribir el ISBN
  inputIsbn.focus(); // Pone el cursor en el ISBN
  estadoOperacion.textContent = "MODO: 3. ELIMINAR LIBRO. Presione el botón ACEPTAR para Eliminarlo"; // Mensaje
}
btnEliminar.addEventListener('click', eliminar); // Enlaza el botón con la función eliminar

//-----------------------------------------------------
const mostrar = () => { // Activa el modo 4. MOSTRAR
  operacionActual = 4; // Guarda que estamos en modo mostrar
  resetearFormulario(); // Limpia la pantalla
  inputIsbn.disabled = false; // Permite escribir el ISBN
  inputIsbn.focus(); // Pone el cursor en el ISBN
  estadoOperacion.textContent = "MODO: 4. INFORMACIÓN DEL LIBRO"; // Actualiza el mensaje
}
btnMostrar.addEventListener('click', mostrar); // Enlaza el botón con la función mostrar

//-----------------------------------------------------

const procesarEnvio = (e) => { // Se ejecuta al enviar el formulario (Guardar Cambios)
  e.preventDefault(); // Evita recargar la página
  const isbn = inputIsbn.value.trim(); // Lee el ISBN (variable disponible si se necesita validar)

  switch (operacionActual) { // Ejecuta la acción según el modo activo
    case 1: guardarLibroEnFormulario(); break; // Modo agregar → crear libro
    case 2: modificarLibroEnFormulario(); break; // Modo modificar → actualizar stock/precio
    case 3: eliminarLibroEnFormulario(); break; // Modo eliminar → borrar del array
    case 4: mostrarLibroEnFormulario(); break; // Modo mostrar → rellenar formulario
  }
  resetearFormulario(); // Limpia todo después de la operación
}
formLibro.addEventListener('submit', procesarEnvio); // Enlaza el envío del formulario

//-------------------------------------------------------


