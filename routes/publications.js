// routes/publications.js
import { Router } from "express";
const router = Router();
import {
  savePublication,
  deletePublication,
  publicationsUser,
  uploadMedia,
  showMedia,
  feed,
  feedGlobal 
} from "../controllers/publications.js";
import { ensureAuth } from "../middlewares/auth.js";
import multer from "multer";
import Publication from "../models/publication.js"
import { checkEntityExists } from "../middlewares/checkEntityExists.js"

// Configuración de subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/publications/");
  },
  filename: (req, file, cb) => {
    cb(null, "pub-"+Date.now()+"-"+file.originalname);
  }
});

// Middleware para subida de archivos
const uploads = multer({storage});

// Definir las rutas
router.post('/new-publication', ensureAuth, savePublication);
router.delete('/delete-publication/:id', ensureAuth, deletePublication);
router.get('/publications-user/:id/:page?', ensureAuth, publicationsUser);
router.post('/upload-media/:id', [ensureAuth, checkEntityExists(Publication, 'id'), uploads.single("file0")], uploadMedia);
router.get('/media/:file', showMedia);
router.get('/feed/:page?', ensureAuth, feed);
router.get('/feed-global/:page?', ensureAuth, feedGlobal);

// Exportar el Router
export default router;