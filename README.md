# Steam Library Explorer — Proyecto Parcial 2

## Link:

https://steamle.vercel.app/

## Descripción del proyecto

Este proyecto está inspirado en una página de videojuegos, con funcionalidades principales como:

- **Base de datos proveniente de Steam:**  
  Los juegos se importan en tiempo real desde la API pública de Steam usando un archivo `gameList.json` con los AppID de referencia.

- **Registro e inicio de sesión:**  
  Permite crear una cuenta y acceder con ella. Las credenciales por defecto se almacenan en `defaultCredentials.json` y se cargan automáticamente si no hay usuarios registrados. Cada usuario tiene nombre, edad, email, contraseña y una biblioteca de juegos (AppIDs).

- **Compra de videojuegos:**  
  Puedes comprar cualquier videojuego mostrado en la web. Es necesario iniciar sesión para comprar, y el juego se añade a la biblioteca del usuario en LocalStorage.

- **Guardado en el LocalStorage:**  
  Todas las credenciales y bibliotecas de usuario se almacenan en LocalStorage y pueden modificarse al comprar juegos.

- **Reestablecimiento de las credenciales:**  
  Es posible restaurar todas las cuentas y cambios realizados, volviendo a las credenciales por defecto.

---

## ¿Cómo se realizó cada parte del proyecto?

### 1. Estructura y modularización

- **Framework y organización:**  
  El proyecto se desarrolló con Vue.js, estructurando el código en carpetas para componentes, vistas, lógica, datos y estilos.  
  Cada funcionalidad principal se implementó como un componente o vista independiente, facilitando la reutilización y el mantenimiento.

- **Componentes reutilizables:**  
  El Navbar se creó como un componente Vue (`Navbar.vue`), permitiendo mostrar enlaces dinámicos según el estado de sesión del usuario.  
  Las tarjetas de juegos y formularios también se diseñaron como componentes reutilizables.

### 2. Importación de juegos desde Steam

- **Archivo de referencia:**  
  Se utilizó `gameList.json` para almacenar los AppID de los juegos a mostrar.
- **Lógica de importación:**  
  El módulo `steamDB.js` contiene funciones que consultan la API pública de Steam y obtienen los datos de cada juego en tiempo real.  
  Los resultados se procesan y se muestran en la vista de productos (`products.vue`).

### 3. Registro e inicio de sesión

- **Formulario de registro:**  
  Implementado en `registration.vue`, valida los datos ingresados, verifica que el correo no esté registrado y que las contraseñas coincidan.  
  Al registrarse, el usuario se guarda en LocalStorage junto con su biblioteca vacía.

- **Formulario de login:**  
  En `login.vue`, se valida el usuario y contraseña contra los datos almacenados en LocalStorage.  
  Si el login es correcto, se guarda el usuario logueado y se redirige a la página principal.

- **Credenciales por defecto:**  
  Al iniciar la aplicación, si no hay usuarios registrados, se cargan las credenciales por defecto desde `defaultCredentials.json`.

### 4. Compra y biblioteca de juegos

- **Compra de juegos:**  
  En la vista de detalles (`game.vue`), el usuario puede comprar el juego actual.  
  Al comprar, el AppID se añade a la biblioteca del usuario logueado en LocalStorage.

- **Biblioteca personalizada:**  
  La vista `Library.vue` muestra la colección de juegos del usuario, importando los datos de cada juego y mostrando tarjetas visuales con imagen, nombre y precio.

### 5. Reestablecimiento de credenciales

- **Funcionalidad de restauración:**  
  Se implementó una opción que permite restaurar las credenciales y bibliotecas a los valores por defecto definidos en `defaultCredentials.json`.  
  Esto se realiza borrando los datos actuales y recargando los valores iniciales.

### 6. Estilos y paleta de colores

- **CSS global:**  
  Los colores y estilos principales se definieron en `assets/colors.css`, inspirados en la paleta de Steam.  
  Se aplicaron variables CSS y clases personalizadas para mantener coherencia visual en todos los componentes.

- **Diseño responsivo:**  
  Se utilizaron utilidades de Bootstrap y media queries para asegurar que la interfaz se adapte correctamente a dispositivos móviles y escritorio.

### 7. Navegación y rutas

- **Vue Router:**  
  La navegación entre vistas se realiza mediante Vue Router (`router/index.js`), permitiendo rutas dinámicas y parámetros en la URL (por ejemplo, `/game?appId=123`).

### 8. Lógica y persistencia

- **Gestión de datos:**  
  La lógica de negocio (importación de juegos, gestión de usuarios) está separada en módulos JS (`logic/steamDB.js`, `logic/dataManager.js`).
- **Persistencia:**  
  El sistema de usuarios y biblioteca utiliza LocalStorage, integrado con la reactividad de Vue para actualizar la interfaz en tiempo real.

---

## Diferencias clave respecto al proyecto anterior

- **Framework Vue.js:**  
  El proyecto anterior era una SPA tradicional con HTML, CSS y JS puros, usando fragmentos y plantillas HTML.  
  Este proyecto utiliza Vue.js, permitiendo una componentización real, reactividad y manejo avanzado de estados y rutas.

- **Componentización avanzada:**  
  Los fragmentos HTML (header, footer) ahora son componentes Vue (`Navbar.vue`), facilitando la reutilización y el mantenimiento.

- **Rutas dinámicas:**  
  Se usa Vue Router para la navegación entre vistas, en vez de múltiples archivos HTML.

- **Estilos globales y personalizados:**  
  Los estilos y la paleta de colores se gestionan en archivos CSS globales (`assets/colors.css`), permitiendo una personalización más sencilla y coherente.

- **Gestión de datos y lógica:**  
  La lógica de negocio está separada en módulos JS, mejorando la organización y el mantenimiento.

- **Biblioteca personalizada:**  
  La vista de biblioteca (`Library.vue`) tiene un diseño y lógica especializada, con tarjetas responsivas y estilos únicos.

---

## Paleta de colores

- color-bg: #171a21;
- color-panel: #1b2838;
- color-border: #2a475e;
- color-accent: #66c0f4;
- color-success: #5c7e10;
- color-text: #c6d4df;
- color-muted: #8f98a0;
- color-hover: #417a9b;

---

## Buenas prácticas aplicadas

- **Nombres consistentes:**  
  camelCase para JS, kebab-case para CSS.
- **Separación de responsabilidades:**  
  HTML, CSS y JS están claramente separados.
- **Componentización:**  
  Uso de componentes Vue y CSS global.
- **Código comentado y documentado:**  
  Comentarios y documentación en el código y README.
- **Colaboración:**  
  Uso de Git y commits claros.
