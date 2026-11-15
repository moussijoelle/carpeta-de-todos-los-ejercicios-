const imagenes = [ // array global con todos los slides del carrusel

  new Imagen( // [0] portada — bienvenida sin imagen
    "", // imagen vacía
    "Mapa del top 20 de mis animes japoneses preferidos", // nombre / título
    "", // title vacío (marca portada)
    "Una exploración visual y técnica de las obras maestras que definen la cultura del entretenimiento nipón." // descripción
  ),

  new Imagen("img/1.jpg", "City Hunter", "Acción / Comedia / Detective", "Acción, comedia y misterio con el legendario detective de Shinjuku.", "Anime 1", 140), // [1] City Hunter

  new Imagen("img/2.jpg", "Space Adventure Cobra", "Ciencia Ficción / Aventura Space Opera", "Space opera con estilo único y uno de mis referentes de ciencia ficción.", "Anime 2", 31), // [2] Cobra

  new Imagen("img/3.jpg", "Dragon Ball Z", "Shonen / Acción / Artes Marciales", "El shonen que marcó generaciones y sigue siendo icono mundial.", "Anime 3", 291), // [3] Dragon Ball Z

  new Imagen("img/4.jpg", "Lady Oscar (La Rosa de Versalles)", "Drama Histórico / Romance", "Drama histórico y romance que elevó el anime a arte narrativo.", "Anime 4", 40), // [4] Lady Oscar

  new Imagen("img/5.jpg", "Galaxy Express 999", "Ciencia Ficción / Aventura Espacial", "Viaje espacial poético y referente del anime de ciencia ficción clásico.", "Anime 5", 113), // [5] Galaxy Express

  new Imagen("img/6.jpg", "Detective Conan", "Misterio / Policial / Suspenso", "El misterio policial de largo recorrido que nunca deja de sorprender.", "Anime 6", "1100+ episodios"), // [6] Detective Conan

  new Imagen("img/7.jpg", "Cowboy Bebop", "Ciencia Ficción / Neo-Noir / Espacial", "Jazz, espacio y neo-noir en una de las series más influyentes.", "Anime 7", 26), // [7] Cowboy Bebop

  new Imagen("img/8.jpg", "My Hero Academia (Boku no Hero)", "Shonen / Superhéroes / Acción", "Superhéroes modernos con corazón shonen y evolución constante.", "Anime 8", "150+ episodios"), // [8] My Hero Academia

  new Imagen("img/9.jpg", "Naruto", "Shonen / Acción / Ninja", "La saga ninja que popularizó el shonen en occidente.", "Anime 9", 220), // [9] Naruto

  new Imagen("img/10.jpg", "Death Note", "Misterio / Thriller Psicológico", "Thriller psicológico magistral sobre poder, moral y genialidad.", "Anime 10", 37), // [10] Death Note

  new Imagen("img/11.jpg", "Ranma ½", "Comedia Romántica / Artes Marciales", "Comedia romántica y artes marciales en su máxima expresión Rumiko.", "Anime 11", 161), // [11] Ranma

  new Imagen("img/12.jpg", "Nadia: El Secreto del Agua Azul", "Aventura / Ciencia Ficción / Steampunk", "Aventura steampunk precursora del espíritu de exploración Ghibli.", "Anime 12", 39), // [12] Nadia

  new Imagen("img/13.jpg", "InuYasha", "Fantasía / Romance / Acción Histórica", "Fantasía histórica y romance épico en el Japón feudal.", "Anime 13", 167), // [13] InuYasha

  new Imagen("img/14.jpg", "One Piece", "Shonen / Aventura / Piratas", "La gran odisea pirata que redefine la aventura shonen.", "Anime 14", "1100+ episodios"), // [14] One Piece

  new Imagen("img/15.jpg", "Pokémon", "Aventura / Fantasía / Mascotas", "Franquicia global de aventura, amistad y coleccionismo.", "Anime 15", "1200+ episodios"), // [15] Pokémon

  new Imagen("img/16.jpg", "Juliette je t'aime (Maison Ikkoku)", "Comedia Romántica / Vida Diaria", "Comedia romántica de convivencia con encanto atemporal.", "Anime 16", 96), // [16] Maison Ikkoku

  new Imagen("img/17.jpg", "Princesa Sarah", "Drama / Histórico / Clásico", "Drama clásico que enseñó resiliencia a varias generaciones.", "Anime 17", 46), // [17] Princesa Sarah

  new Imagen("img/18.jpeg", "Totoro", "Fantasía / Familiar / Studio Ghibli", "Joyas de Studio Ghibli que cierran el mapa con calidez familiar.", "Anime 18", "Película clásica"), // [18] Totoro

  new Imagen("img/19.jpg", "Saint Seiya (Los Caballeros del Zodíaco)", "Shonen / Acción / Mitología", "Mitología, armaduras sagradas y batallas épicas del recuerdo.", "Anime 19", 114), // [19] Saint Seiya

  new Imagen("img/20.jpg", "Quiero comer tu páncreas", "Drama / Romance / Recuentos de la vida", "Un conmovedor y visualmente bellísimo drama romántico sobre el valor de la vida y las conexiones inesperadas.", "Anime 20", "1 Película (108 minutos)"), // [20] Quiero comer tu páncreas

  new Imagen( // [21] slide info final — tema día/noche
    "", // sin imagen
    "Modo día y noche", // título
    "Info", // marca slide informativo (esInfo())
    "Puedes ver esta página en tema claro u oscuro. Haz clic en el icono del sol (arriba a la derecha) para el modo día y en la luna para el modo noche.", // descripción corta
    "", // sin puesto
    null, // sin episodios
    "El anime japonés es uno de los fenómenos culturales más influyentes de las últimas décadas: series, películas y estudios han exportado narrativas, estética y valores a todo el mundo. Hoy impulsa la industria del entretenimiento, el merchandising, el turismo en Japón y comunidades globales de fans, y sigue renovando géneros desde el shōnen hasta el seinen.", // párrafo extra
    "https://es.wikipedia.org/wiki/Anime", // URL fuente
    "Wikipedia — Anime" // texto del enlace
  ),
]; // fin del array imagenes
