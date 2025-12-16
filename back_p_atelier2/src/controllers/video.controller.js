const { pool, testConnection } = require('../db/index.js');
const Video = require('../models/videoModel.js');
const uploadVideoService = require('../services/uploadVideo.service.js');
const generateThumbnail = require('../utils/generateThumbnail.js');


// touts nos videos
async function getVideos(req, res) {
    // console.log("ici test videos");

    // await testConnection();

   //ma logique
    try {
      const videos = await Video.getAllVideos();

      console.log("List de mes videos", videos);
      
      res.status(200).json({
        success: true,
        message: "Videos trouvees",
        videos: videos
        
      });
    }catch(error) {
      console.log("Erreur dans la recuperation des videos", error);
      res.status(500).json({
        success: false,
        message: "Erreur dans la recuperation des videos"
      });
    }
}


//video par son id
async function getVideoById(req, res) {

  //ma logique
  try {
    // on recupere l id de video
    const video = await Video.getVideoById(req.params.id);
    if (!video) {
      console.log("Video non trouvee");
      return res.status(404).json({
        success: false,
        message: "Video non trouvee"
      });
    }
    // on affiche la video trouvee sur cmder
    console.log("Video trouvee", video);
    
    res.status(200).json({
      message: "Video trouvee",
      video: video,
      success: true
    });
  }catch(error) {
    console.log("Erreur dans la recuperation de la video", error);
    res.status(500).json({
      success: false,
      message: "Erreur dans la recuperation de la video"
    });
  }
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