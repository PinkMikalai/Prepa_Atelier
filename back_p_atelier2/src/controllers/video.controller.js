const { success } = require('zod');
const path = require('path');
const fs = require('fs');
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
      const videos = await Video.findWithFilters(req.query);
      console.log("Filtres appliqués :", req.query);
      console.log("Nombre de vidéos trouvées :", videos.length);

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
    const { videoPath, thumbnailPath } = await uploadVideoService.upload(req, res);

    // 2️⃣ MAINTENANT req.body existe
    const { pseudo, title, description, theme_id } = req.body;

    if (!pseudo || !title || !theme_id) {
      return res.status(400).json({
        message: "pseudo, title et theme_id sont obligatoires",
      });
    }
    console.log(pseudo);
    console.log(title);
    console.log(theme_id);
    
    // Extraire le nom du fichier vidéo depuis le chemin absolu
    const videoFilename = path.basename(videoPath);
    console.log('Nom du fichier vidéo:', videoFilename);

    // 3️⃣ Vérification doublon titre
    const existing = await Video.findByTitle(title);
    if (existing) {
      return res.status(400).json({
        message: `Une vidéo avec le titre "${title}" existe déjà.`,
      });
    }

    // 4️⃣ Gestion de la miniature : utiliser celle uploadée ou générer une
    let thumbnail;
    if (thumbnailPath) {
      // Utiliser la miniature uploadée
      thumbnail = thumbnailPath;
      console.log('Miniature uploadée utilisée:', thumbnail);
    } else {
      // Générer une miniature depuis la vidéo
      thumbnail = await generateThumbnail(videoPath);
      console.log('Miniature générée:', thumbnail);
    }

    // 5️⃣ DB - Sauvegarder le nom du fichier vidéo pour lier chaque vidéo à son ID unique
    const id = await Video.create({
      pseudo,
      title,
      description,
      theme_id,
      thumbnail,
      video_path: videoFilename,
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
        video_path: videoFilename,
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
async function updateVideo(req, res) {

  //ma logique 
  try{
    // l id de la video a modifier
    const videoById = req.params.id;

    // on recupere les donnees de la video a modifier
    const {pseudo, title, description, theme_id, thumbnail} = req.body;



    // verifier que la video existe
    const existingVideo = await Video.getVideoById(videoById);
    if(!existingVideo){
      return res.status(404).json({
        success: false,
        message: "Video non trouvée"
      });
    }

    // mise a jour
    const result = await Video.update(videoById, {
      pseudo: pseudo ?? existingVideo.pseudo,
      title: title ?? existingVideo.title,
      description: description ?? existingVideo.description,
      theme_id: theme_id ?? existingVideo.theme_id,
      thumbnail : thumbnail ?? existingVideo.thumbnail,
    });

    res.status(200).json({
      success : true,
      message: "Video a ete modifie",
      videoId : videoById, //l id de la video modifiee
    })
    console.log("video a ete modifie avec success", result);
  }catch(error){
    console.log("erreur globale lors de modif catch", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de modification de la video"
    });
  }
}

//supprimer une video
async function deleteVideo(req, res) {

  try{

    // l id de la video a supprimer
    const videoById = req.params.id;
 
    //verifier que la video existe avant de la supprimer
    const existingVideo = await Video.getVideoById(videoById);
    if(!existingVideo){
      return res.status(404).json({
        success: false,
        message: "Video non trouvee et ne peu pas etre supprimee"
      });
    }

    //suppresion de la video
    const result = await Video.delete(videoById);
    
    
    res.status(200).json({
      success: true,
      message: "Video a ete supprimee avec success",
      videoId: videoById, //l id de la video supprimee
    })
    console.log("video a ete supprimee avec success", result);


  }catch(error) {
    console.log("erreur globale lors de la suppresion de la video", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la video"
    });

  }

}



async function addView(req, res) {
    try {
        const video_id = req.params.video_id;
        const result = await videoService.addView(video_id);

        if (!result.success) return res.status(404).json(result);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}


// Servir le fichier vidéo par ID - utilise video_path depuis la DB pour garantir la bonne vidéo
async function getVideoFile(req, res) {
  try {
    const video = await Video.getVideoById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Vidéo non trouvée"
      });
    }

    // Utiliser video_path depuis la DB pour servir le bon fichier lié à cet ID
    if (!video.video_path) {
      return res.status(404).json({
        success: false,
        message: "Chemin vidéo non trouvé dans la base de données pour cette vidéo"
      });
    }

    const videosDir = path.join(__dirname, './assets/uploads/videos');
    const videoPath = path.join(videosDir, video.video_path);
    
    console.log(`Lecture vidéo ID ${req.params.id} -> fichier: ${video.video_path}`);
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(videoPath)) {
      console.error(`Fichier vidéo non trouvé: ${videoPath}`);
      return res.status(404).json({
        success: false,
        message: "Fichier vidéo non trouvé sur le serveur"
      });
    }

    // Servir le fichier - chaque ID correspond à son propre fichier
    res.sendFile(videoPath);
  } catch (error) {
    console.error("Erreur lors de la récupération du fichier vidéo:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du fichier vidéo"
    });
  }
}

module.exports = { 
    getVideos, 
    getVideoById, 
    createVideo, 
    updateVideo, 
    deleteVideo,
    getVideoFile, 
    addView
};