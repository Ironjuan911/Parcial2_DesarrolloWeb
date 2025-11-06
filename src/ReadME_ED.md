# Análisis y Diseño de Algoritmos — parcial2_desarrolloweb

Este documento resume el análisis funcional y el diseño de algoritmos de la aplicación web. Incluye qué puede hacer la página, cómo está implementado (diseño) y cómo se usan estructuras lineales (listas, pilas/colas) junto con la persistencia en localStorage (JSON).

---

## 1. Resumen funcional (qué hace la aplicación)

La web permite, entre otras cosas:
- Mostrar una lista de productos/juegos (products) a partir de `src/data/gameList.json`.
- Consultar detalles de cada juego (vista `game.vue`) usando la lógica en `logic/steamDB.js`.
- Mostrar una librería de usuario con imágenes (vista `Library.vue`).
- Registro e inicio de sesión de usuarios, persistencia de usuarios en localStorage (`src/data/defaultCredentials.json` como seed).
- Navegación entre vistas mediante Vue Router (`/products`, `/game`, `/library`, `/login`, `/registration`).
- Barra de navegación dinámica (`components/Navbar.vue`) que renderiza ítems según el estado de sesión.

---

## 2. Requisitos técnicos cumplidos

- Uso de listas: listas para colecciones (lista de juegos, lista de usuarios, navElements, libraryList, steamGameList).
- Persistencia de datos: `localStorage` guarda objetos JSON:
  - `usuarios` — lista de usuarios con esquema { id, name, age, email, password, library: [] }.
  - `usuarioLogueado` — objeto del usuario actualmente autenticado.
- Uso propuesto de pilas/colas: no están aplicadas directamente en el código original; se proponen usos y diseños prácticos abajo.

---

## 3. Diseño de datos (esquemas)

- GameList (importado desde JSON):
  - Lista de { id: number }
- User:
  - { id: number, name: string, age: number|null, email: string, password: string, library: number[] }
- Library item (resultado de importLibrary):
  - { appId: number, library_600x900: string, library_hero: string, logo: string }

Persistencia:
- `localStorage.setItem('usuarios', JSON.stringify(usuarios))`
- `localStorage.setItem('usuarioLogueado', JSON.stringify(usuario))`

---

## 4. Diseño de algoritmos principales

A) Carga de productos (ProductsView)
- Propósito: obtener datos detallados para cada id presente en la lista de juegos y preparar la vista con la información necesaria (nombre, imagen, descripción).
- Entrada: lista de ids de juegos (gameList) y el servicio `steamDB` que sabe cómo obtener detalles por id.
- Salida: lista (ordenada según entrada) de objetos de detalles de juego, almacenada en `steamGameList`.
- Pasos:
  1. Construir una lista de tareas, una por cada id en `gameList`.
  2. Ejecutar las tareas de forma concurrente con un límite de concurrencia razonable (p.ej. 4) para evitar saturar la red o el proxy.
  3. Para cada tarea: llamar a `steamDB.importarJuego(id)`, validar la respuesta y normalizar el objeto (asegurarse de que tenga `id`, `name`, `header_image`, `short_description`, etc.).
  4. Recolectar todos los resultados, filtrar entradas nulas o erróneas, y asignar la lista resultante a `steamGameList`.
- Errores y recuperación:
  - Si una petición falla, registrar el error y sustituir por un objeto placeholder (para que el template no rompa).
  - Si la lista es muy grande, procesar en lotes o usar una cola con concurrencia controlada.
- Complejidad: O(n) en número de peticiones; tiempo depende de latencias y concurrencia.

B) Registro de usuario (RegistrationView)
- Propósito: añadir un nuevo usuario a la lista persistida en localStorage.
- Entrada: datos del formulario (`name`, `email`, `password`, `confirmPassword`).
- Salida: `usuarios` actualizado en localStorage; posible redirección al login.
- Pasos:
  1. Validar que los campos obligatorios estén presentes y que `password === confirmPassword`.
  2. Leer la lista `usuarios` desde localStorage y parsearla (si no existe, crear una lista vacía).
  3. Verificar unicidad del correo (recorrer la lista y comparar).
  4. Calcular `nextId` como (máximo id actual + 1) o 1 si no hay usuarios.
  5. Construir el objeto `nuevoUsuario` con el esquema establecido y añadirlo a la lista.
  6. Serializar la lista y guardarla en localStorage.
  7. Informar al usuario (mensaje) y opcionalmente redirigir.
- Errores y recuperación:
  - Si localStorage no está disponible, usar un fallback en memoria y avisar.
  - Validar formatos (correo, longitud mínima de contraseña).
- Complejidad: O(n) para verificar unicidad (se puede optimizar con índices si fuese necesario).

C) Importar imágenes de la librería (steamDB.importLibrary)
- Propósito: obtener las URLs válidas de diferentes variantes de imagen para un `appId`.
- Entrada: `appId` y, opcionalmente, un `urlProxy` para evitar problemas CORS.
- Salida: objeto con forma { appId, library_600x900: url | '', library_hero: url | '', logo: url | '' }.
- Pasos:
  1. Definir las rutas relativas que se desean comprobar (lista de tipos: library_600x900.jpg, library_hero.jpg, logo.png).
  2. Para cada tipo, construir la URL completa combinando base (posible proxy + dominio de Steam) + path + appId + nombre de archivo.
  3. Intentar una solicitud liviana (HEAD) para comprobar si el recurso existe; si falla o no responde, intentar GET como fallback.
  4. Si la respuesta es satisfactoria (HTTP 200), asignar la URL al campo correspondiente en el objeto resultado; en caso contrario, asignar cadena vacía o placeholder.
  5. Devolver el objeto normalizado (no una lista envolvente) para facilitar su consumo.
- Errores y recuperación:
  - Registrar y devolver cadenas vacías cuando el recurso no exista; usar una imagen placeholder en la vista.
  - Manejar timeouts y reintentos razonables según política.
- Consideraciones de rendimiento: comprobar HEAD para evitar descargar archivos grandes; procesar varios `appId` con concurrencia limitada.

D) Lectura de parámetros de ruta (GameView)
- Propósito: obtener `appId` desde `this.$route.query` o desde `window.location` si hace falta.
- Pasos:
  1. En `mounted`, leer `this.$route.query.appId`; si no existe, usar URLSearchParams sobre `window.location.search`.
  2. Validar que `appId` sea numérico o convertible.
  3. Llamar a `steamDB.importarJuego(appId)` y asignar el resultado a `game`.
- Errores: manejar `appId` ausente o inválido con una alerta y/o redirección.

## 5. Desarrollo de la cola para importación de juegos

**Propósito:**  
Optimizar la importación masiva de datos de juegos desde la API de Steam, evitando saturar el navegador o el proxy y manteniendo el orden de los resultados.

**Diseño y funcionamiento:**  
La cola se implementa como una estructura de control de concurrencia. Se mantiene una lista de tareas (cada tarea es la importación de un juego por su ID) y un número limitado de "trabajadores" (workers) que procesan las tareas en paralelo. Cada vez que un worker termina una tarea, toma la siguiente disponible en la lista hasta que todas estén procesadas.

**Pasos del algoritmo:**

1. Se recibe una lista de IDs de juegos a importar y el número máximo de peticiones simultáneas (concurrencia).
2. Se inicializa una lista de resultados vacía y un índice para recorrer la lista de IDs.
3. Se crean varios workers (tantos como concurrencia), cada uno ejecutando un bucle:
    - Mientras queden IDs por procesar, el worker toma el siguiente ID y llama a `importarJuego`.
    - El resultado se almacena en la posición correspondiente de la lista de resultados.
    - Si ocurre un error, se almacena `null` y se registra el error.
4. Cuando todos los workers han terminado, se devuelve la lista de resultados, manteniendo el orden original de los IDs.