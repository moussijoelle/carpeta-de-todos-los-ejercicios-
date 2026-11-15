const preguntas = [
  new Pregunta(
    "¿Cuál es el código HTML correcto para un salto de línea?",
    ["<br>", "<break/>", "</p>", "<hr>"],
    "a",
    5,
    "La etiqueta <br> inserta un salto de línea. No necesita etiqueta de cierre."
  ),
  new Pregunta(
    "¿Qué etiqueta define el encabezado principal de mayor jerarquía?",
    ["<h1>", "<head>", "<header>", "<title>"],
    "a",
    5,
    "<h1> es el título más importante visible. <head> y <title> son metadatos."
  ),
  new Pregunta(
    "¿Qué atributo de <a> indica la URL de destino del enlace?",
    ["href", "src", "link", "url"],
    "a",
    5,
    "href define a dónde apunta el enlace. src se usa en imágenes o scripts."
  ),
  new Pregunta(
    "¿Qué etiqueta se usa para insertar una imagen?",
    ["<img>", "<image>", "<picture>", "<src>"],
    "a",
    5,
    "La etiqueta correcta es <img>. Suele llevar src y alt."
  ),
  new Pregunta(
    "¿Para qué sirve el atributo alt en una imagen?",
    ["Describir la imagen para accesibilidad", "Cambiar el tamaño", "Añadir un enlace", "Definir el color de fondo"],
    "a",
    5,
    "alt ofrece un texto alternativo si la imagen no carga o para lectores de pantalla."
  ),
  new Pregunta(
    "¿Qué etiqueta crea una lista desordenada con viñetas?",
    ["<ul>", "<ol>", "<li>", "<list>"],
    "a",
    5,
    "<ul> crea listas con viñetas. <ol> es numerada y <li> es cada elemento."
  ),
  new Pregunta(
    "¿Qué etiqueta representa un elemento de lista?",
    ["<li>", "<ul>", "<item>", "<ld>"],
    "a",
    5,
    "<li> marca cada elemento dentro de <ul> o <ol>."
  ),
  new Pregunta(
    "¿Qué etiqueta envuelve el contenido principal visible de la página?",
    ["<body>", "<html>", "<main>", "<section>"],
    "a",
    5,
    "<body> contiene todo lo visible de la página."
  ),
  new Pregunta(
    "¿Qué meta etiqueta define la codificación de caracteres del documento?",
    ['<meta charset="UTF-8">', '<meta name="viewport">', "<charset>", '<meta encoding="utf8">'],
    "a",
    5,
    'charset="UTF-8" permite ver bien tildes, eñes y símbolos.'
  ),
  new Pregunta(
    "¿Qué etiqueta agrupa campos de un formulario y puede tener un título con <legend>?",
    ["<fieldset>", "<form>", "<group>", "<section>"],
    "a",
    5,
    "<fieldset> agrupa campos. <legend> describe el grupo."
  ),
  new Pregunta(
    "¿Qué tipo de input se usa para un correo electrónico?",
    ['type="email"', 'type="text"', 'type="mail"', 'type="correo"'],
    "a",
    5,
    'type="email" es el tipo pensado para correos.'
  ),
  new Pregunta(
    "¿Qué etiqueta permite escribir varias líneas de texto?",
    ["<textarea>", "<input>", "<text>", "<multiline>"],
    "a",
    5,
    "<textarea> es multilínea. <input> suele ser de una sola línea."
  ),
  new Pregunta(
    "¿Qué etiqueta define una fila en una tabla?",
    ["<tr>", "<td>", "<th>", "<row>"],
    "a",
    5,
    "<tr> es la fila. <td> y <th> van dentro."
  ),
  new Pregunta(
    "¿Qué etiqueta define una celda de datos en una tabla?",
    ["<td>", "<tr>", "<table>", "<cell>"],
    "a",
    5,
    "<td> guarda el dato. <th> es para cabeceras."
  ),
  new Pregunta(
    "¿Qué atributo abre un enlace en una pestaña nueva?",
    ['target="_blank"', 'href="_blank"', 'open="new"', 'window="blank"'],
    "a",
    5,
    'target="_blank" abre el enlace en otra pestaña.'
  ),
  new Pregunta(
    "¿Qué etiqueta indica texto con fuerte importancia semántica?",
    ["<strong>", "<b>", "<important>", "<em>"],
    "a",
    5,
    "<strong> tiene significado. <b> solo pinta en negrita."
  ),
  new Pregunta(
    "¿Qué etiqueta se usa para énfasis que altera el significado de una frase?",
    ["<em>", "<i>", "<italic>", "<mark>"],
    "a",
    5,
    "<em> da énfasis con sentido. <i> es más visual."
  ),
  new Pregunta(
    "¿Dónde se enlazan hojas de estilo CSS externas?",
    ['<link rel="stylesheet" href="...">', '<style src="...">', '<css href="...">', '<script rel="css">'],
    "a",
    5,
    'El CSS externo va con <link rel="stylesheet"> en el head.'
  ),
  new Pregunta(
    "¿Qué etiqueta introduce contenido semántico de cabecera de página o sección?",
    ["<header>", "<head>", "<h1>", "<top>"],
    "a",
    5,
    "<header> es la cabecera visible. <head> no se ve en pantalla."
  ),
  new Pregunta(
    "¿Qué declaración debe ir al inicio de un documento HTML5?",
    ["<!DOCTYPE html>", "<html5>", "<?html?>", "<!HTML5>"],
    "a",
    5,
    "<!DOCTYPE html> indica al navegador que es HTML5."
  ),
];
