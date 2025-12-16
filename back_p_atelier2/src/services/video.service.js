const Video = require('../models/videoModel.js');
const uploadVideoService = require('./uploadVideo.service.js');
const generateThumbnail = require('../utils/generateThumbnail.js');

const videoService = {
  async createVideo({ pseudo, title, description, theme_id, thumbnail, file }) {
    if (!file) {
      throw { status: 400, message: 'Aucun fichier vidéo fourni.' };
    }

    // Vérification doublon titre
    const existing = await Video.findByTitle(title);
    if (existing) {
      throw { status: 400, message: `Une vidéo avec le titre "${title}" existe déjà.` };
    }

    // Stockage vidéo sur disque
    await uploadVideoService.upload(file);

    // Miniature
    let thumbnail_path;
    if (thumbnail) {
      thumbnail_path = thumbnail; // fournie par l'utilisateur
    } else {
      thumbnail_path = await generateThumbnail(file.path); // génération automatique
    }

    // Création en base (pas de video_path)
    const videoData = {
      pseudo,
      title,
      description,
      theme_id,
      thumbnail: thumbnail_path
    };

    const id = await Video.create(videoData);
    return { id, ...videoData };
  }
};

module.exports = videoService;
