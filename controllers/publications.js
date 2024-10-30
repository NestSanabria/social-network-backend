// controllers/publications.js
import Publication from "../models/publication.js";
import fs from "fs";
import path from "path";
import { followUserIds } from "../services/followServices.js";

// Método para hacer una publicación
export const savePublication = async (req, res) => {
  try {
    const params = req.body;

    if (!params.text) {
      return res.status(400).send({
        status: "error",
        message: "Debes enviar el texto de la publicación",
      });
    }

    let newPublication = new Publication({
      ...params,
      user_id: req.user.userId,
    });

    const publicationStored = await newPublication.save();
    if (!publicationStored) {
      return res.status(500).send({
        status: "error",
        message: "No se ha guardado la publicación",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "¡Publicación creada con éxito!",
      publicationStored,
    });
  } catch (error) {
    console.error("Error al crear la publicación:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al crear la publicación",
    });
  }
};

// Método para eliminar una publicación
export const deletePublication = async (req, res) => {
  try {
    const publicationId = req.params.id;

    const publicationDeleted = await Publication.findOneAndDelete({
      user_id: req.user.userId,
      _id: publicationId,
    }).populate("user_id", "name last_name");

    if (!publicationDeleted) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado o no tienes permiso para eliminar esta publicación",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Publicación eliminada con éxito",
      publication: publicationDeleted,
    });
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al eliminar la publicación",
    });
  }
};

// Método para listar publicaciones de un usuario
export const publicationsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let page = req.params.page ? parseInt(req.params.page, 10) : 1;
    let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 5;

    const options = {
      page,
      limit: itemsPerPage,
      sort: { created_at: -1 },
      populate: { path: "user_id", select: "-password -role -__v -email" },
      lean: true,
    };

    const publications = await Publication.paginate({ user_id: userId }, options);

    if (!publications.docs || publications.docs.length <= 0) {
      return res.status(404).send({
        status: "error",
        message: "No hay publicaciones para mostrar",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Publicaciones del usuario:",
      publications: publications.docs,
      total: publications.totalDocs,
      pages: publications.totalPages,
      page: publications.page,
      limit: publications.limit,
    });
  } catch (error) {
    console.error("Error al listar publicaciones:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al listar las publicaciones",
    });
  }
};

// Método para subir archivos a las publicaciones
export const uploadMedia = async (req, res) => {
  try {
    const publicationId = req.params.id;
    const publicationExists = await Publication.findById(publicationId);
    if (!publicationExists) {
      return res.status(404).send({
        status: "error",
        message: "No existe la publicación",
      });
    }

    if (!req.file) {
      return res.status(400).send({
        status: "error",
        message: "La petición no incluye la imagen",
      });
    }

    let image = req.file.originalname;
    const extension = image.split(".").pop().toLowerCase();
    if (!["png", "jpg", "jpeg", "gif"].includes(extension)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).send({
        status: "error",
        message: "Extensión del archivo es inválida.",
      });
    }

    const maxFileSize = 1 * 1024 * 1024;
    if (req.file.size > maxFileSize) {
      fs.unlinkSync(req.file.path);
      return res.status(400).send({
        status: "error",
        message: "El tamaño del archivo excede el límite (máx 1 MB)",
      });
    }

    const publicationUpdated = await Publication.findOneAndUpdate(
      { user_id: req.user.userId, _id: publicationId },
      { file: req.file.filename },
      { new: true }
    );

    if (!publicationUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error en la subida del archivo",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Archivo subido con éxito",
      publication: publicationUpdated,
      file: req.file,
    });
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al subir el archivo a la publicación",
    });
  }
};

// Método para mostrar el archivo de una publicación
export const showMedia = async (req, res) => {
  try {
    const file = req.params.file;
    const filePath = "./uploads/publications/" + file;

    fs.stat(filePath, (error, exists) => {
      if (!exists) {
        return res.status(404).send({
          status: "error",
          message: "No existe la imagen",
        });
      }
      return res.sendFile(path.resolve(filePath));
    });
  } catch (error) {
    console.error("Error al mostrar archivo:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al mostrar archivo en la publicación",
    });
  }
};

// Método para listar todas las publicaciones de los usuarios que sigo (Feed)
export const feed = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1; // Cambiado para obtener la página de los query params
    let itemsPerPage = parseInt(req.query.limit) || 5;

    if (!req.user?.userId) {
      return res.status(401).send({
        status: "error",
        message: "Usuario no autenticado",
      });
    }

    const myFollows = await followUserIds(req);
    if (!myFollows.following || myFollows.following.length === 0) {
      return res.status(200).send({
        status: "success",
        message: "No sigues a ningún usuario, no hay publicaciones que mostrar",
        publications: [],
      });
    }

    const options = {
      page,
      limit: itemsPerPage,
      sort: { created_at: -1 },
      populate: { path: "user_id", select: "-password -role -__v -email" },
      lean: true,
    };

    const result = await Publication.paginate(
      { user_id: { $in: myFollows.following } },
      options
    );

    return res.status(200).send({
      status: "success",
      message: "Feed de Publicaciones",
      publications: result.docs,
      total: result.totalDocs,
      pages: result.totalPages,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    console.error("Error al mostrar publicaciones en el feed:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al mostrar las publicaciones en el feed",
    });
  }
};


// Método para listar todas las publicaciones de todos los usuarios (Feed Global)
export const feedGlobal = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1; // Cambiado para obtener la página de los query params
    let itemsPerPage = parseInt(req.query.limit) || 5; // Los límites también deben venir de query params

    const options = {
      page,
      limit: itemsPerPage,
      sort: { created_at: -1 },
      populate: { path: "user_id", select: "-password -role -__v -email" },
      lean: true,
    };

    const result = await Publication.paginate({}, options);

    return res.status(200).send({
      status: "success",
      message: "Feed global de Publicaciones",
      publications: result.docs,
      total: result.totalDocs,
      pages: result.totalPages,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    console.error("Error al mostrar publicaciones en el feed global:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al mostrar las publicaciones en el feed global",
    });
  }
};