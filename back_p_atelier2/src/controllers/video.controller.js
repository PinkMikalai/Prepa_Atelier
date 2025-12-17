const { pool, testConnection } = require('../db/index.js');
const Video = require('../models/videoModel.js');
const uploadVideoService = require('../services/uploadVideo.service.js');
const generateThumbnail = require('../utils/generateThumbnail.js');


// touts nos videos
async function getVideos(req, res) {

    console.log("ici test videos");

    await testConnection();
}


//video par son id
function getVideoById(req, res) {

}

//creer une video
async function createVideo(req, res) {
 try {
    // 1️⃣ Multer parse form-data (fichier + champs texte)
    const absolutePath  = await uploadVideoService.upload(req, res);

    // 2️⃣ MAINTENANT req.body existe
    const { pseudo, title, description, theme_id } = req.body;

    if (!pseudo || !title || !theme_id) {
      return res.status(400).json({
        message: "pseudo, title et theme_id sont obligatoires",
      });
    }

    // 3️⃣ Vérification doublon titre
    const existing = await Video.findByTitle(title);
    if (existing) {
      return res.status(400).json({
        message: `Une vidéo avec le titre "${title}" existe déjà.`,
      });
    }

    // 4️⃣ Génération miniature
    const thumbnail = await generateThumbnail(absolutePath);

    // 5️⃣ DB
    const id = await Video.create({
      pseudo,
      title,
      description,
      theme_id,
      thumbnail,
    });

    res.status(201).json({
      message: "Vidéo créée avec succès",
      video: {
        id,
        pseudo,
        title,
        description,
        theme_id,
        thumbnail,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message || "Erreur serveur",
    });
  }
}

//mettre a jour une video
function updateVideo(req, res) {
}

//supprimer une video
function deleteVideo(req, res) {
}


module.exports = { 
    getVideos, 
    getVideoById, 
    createVideo, 
    updateVideo, 
    deleteVideo 
};