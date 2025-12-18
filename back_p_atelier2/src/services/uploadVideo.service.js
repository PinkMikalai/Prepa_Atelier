const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../assets/uploads/videos");
const THUMBNAIL_DIR = path.join(__dirname, "../assets/uploads/img");
const MAX_SIZE = 500 * 1024 * 1024; // 500 Mo
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_MIME = [
  "video/mp4",
  "video/webm",
  "video/avi",
  "video/quicktime",
];
const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

// multer.diskStorage pour les vidéos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// multer.diskStorage pour les thumbnails
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(THUMBNAIL_DIR)) {
      fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
    }
    cb(null, THUMBNAIL_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `thumbnail-${uniqueSuffix}${ext}`);
  },
});

// vérification du type MIME pour les vidéos
const videoFileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format de vidéo non supporté"));
  }
};

// vérification du type MIME pour les thumbnails
const thumbnailFileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format d'image non supporté"));
  }
};

// Création du middleware Multer pour vidéo et thumbnail
const upload = multer({
  storage: videoStorage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: videoFileFilter,
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

const uploadVideoService = {

  upload(req, res) {
    return new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return reject({
              status: 400,
              message: "Fichier trop volumineux.",
            });
          }
          return reject({ status: 400, message: err.message });
        }
        if (!req.files || !req.files.video || !req.files.video[0]) {
          return reject({
            status: 400,
            message: "Aucun fichier vidéo fourni.",
          });
        }

        // Chemin relatif pour DB
        const videoPath = path.join(__dirname, "../assets/uploads/videos", req.files.video[0].filename);
        
        // Si un thumbnail a été uploadé, le traiter
        let thumbnailPath = null;
        if (req.files.thumbnail && req.files.thumbnail[0]) {
          thumbnailPath = req.files.thumbnail[0].filename;
        }
        
        resolve({ videoPath, thumbnailPath }); // renvoie les chemins
      });
    });
  },
};

module.exports = uploadVideoService;
