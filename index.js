// index.js
import connection from "./database/connection.js";
import express from "express";
import cors from "cors";
import UserRoutes from './routes/user.js';
import PublicationRoutes from './routes/publications.js';
import FollowRoutes from './routes/follow.js';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

// Cargar configuración desde .env
dotenv.config();

// Mensaje de bienvenida
console.log("API NODE arriba");

// Conexión a la BD
connection();

// Crear servidor de Node
const app = express();
const puerto = process.env.PORT || 3900;

// Configurar CORS solo para los dominios permitidos
const allowedOrigins = ['http://localhost:5173']; //['http://localhost:5173', 'https://frontend-deploy-url.com'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204
}));

// Conversión de datos (body a objetos JS)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar rutas
app.use('/api/user', UserRoutes);
app.use('/api/publication', PublicationRoutes);
app.use('/api/follow', FollowRoutes);

// Configuración para servir archivos estáticos (imágenes de avatar y publicaciones)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads', 'avatars')));
app.use('/uploads/publications', express.static(path.join(__dirname, 'uploads', 'publications')));

// Configurar el servidor para escuchar las peticiones HTTP
app.listen(puerto, () => {
  console.log("Servidor de NODE corriendo en el puerto", puerto);
});

export default app;
