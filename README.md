# Red Social Básica - API REST para Red Social (Backend)

Bienvenido a la Red Social Básica, un proyecto diseñado para facilitar la interacción y conexión entre usuarios en un entorno social en línea. Este backend ofrece una serie de características clave para gestionar la experiencia del usuario:

## Características

Registro y Autenticación de Usuarios: Permite a los nuevos usuarios registrarse y acceder a su cuenta de forma segura mediante autenticación basada en JWT (JSON Web Tokens).

Gestión de Seguidores: Los usuarios pueden seguir a otros usuarios y ser seguidos, creando una red personalizada y facilitando la interacción.

Publicaciones: Los usuarios pueden crear y compartir publicaciones, permitiendo la expresión y difusión de ideas, imágenes y pensamientos.

Visualización de Contenido: Los usuarios pueden explorar las publicaciones de quienes siguen, manteniéndose actualizados sobre las actividades de sus amigos y conexiones.

Actualización de Perfil: Los usuarios tienen la capacidad de actualizar su perfil, incluyendo la opción de añadir una imagen de perfil, lo que mejora la personalización y la representación en la red.

## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)

## Tecnologías

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework web para construir APIs.
- **MongoDB**: Base de datos NoSQL para almacenar información de usuarios.
- **Mongoose**: ODM (Object Data Modeling) para interactuar con MongoDB.
- **bcrypt**: Biblioteca para la encriptación de contraseñas y seguridad.
- **jsonwebtoken (jwt-simple)**: Para la creación y verificación de tokens JWT para la autenticación.
- **body-parser**: Middleware para analizar cuerpos de solicitudes HTTP.
- **cors**: Middleware para habilitar el intercambio de recursos de origen cruzado (CORS).
- **dotenv**: Para manejar variables de entorno y configuraciones sensibles.
- **multer**: Middleware para manejar la carga de archivos (como imágenes de perfil).
- **moment**: Biblioteca para manejar y formatear fechas y horas.
- **mongoose-paginate-v2**: Para implementar la paginación en las consultas de MongoDB.
- **validator**: Para validar y sanitizar datos de entrada.

## Instalación

Para ejecutar este proyecto en tu máquina local, sigue estos pasos:

1. Clona este repositorio en tu máquina local (Crea un Fork si lo vas a editar):

    ```bash
    git clone https://github.com/NestSanabria/social-network-backend.git
    ```

2. Navega al directorio del proyecto:

    ```bash
    cd social-network-backend
    ```

3. Crea una carpeta en la raíz del proyecto llamada: .env: configura las variables de entorno con el string de conexión a Mongo Atlas Cloud y el puerto de conexión en local, así

    ```bash
    MONGODB_URI=aquí el string de conexión a MongoDB Atlas o MongoDB local sin comillas
    PORT=####
    SECRET_KEY=SECRET_KEY_oTrOs_cArAcTeReS_CLAVE
    ```
4. Instala las dependencias del proyecto utilizando npm:

    ```bash
    npm install
    ```

5. Inicia el servidor usando npm:

    ```bash
    npm run dev
    ```

> [!IMPORTANT]
> Asegúrate de tener Mongo Atlas Cloud configurado correctamente y la conexión de base de datos en el archivo `.env` antes de ejecutar el archivo de inicio. Este proyecto está configurado para trabajar con una conexión a Base de Datos con Mongo Atlas Cloud.


## Uso

El frontend del proyecto se encuentra en la siguiente ruta:

    ```bash
    https://github.com/NestSanabria/social-network-frontend
    ```

