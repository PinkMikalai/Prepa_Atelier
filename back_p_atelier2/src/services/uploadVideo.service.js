const multer = require("multer");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "../assets/uploads/videos");
const MAX_SIZE = 500 * 1024 * 1024; // 500 Mo
const ALLOWED_MIME = [
  "video/mp4",
  "video/webm",
  "video/avi",
  "video/quicktime",
];


// multer.diskStorage : ou et comment stocker les fichiers sur le disque
const storage = multer.diskStorage({
  // calback de Multer cb - destination ou on va stocker le fichier
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  // filename : le nom à utiliser pour le fichier 
  filename: (req, file, cb) => {
    // originalname : on garde le title d'origine 
    cb(null, file.originalname);
  },
});

// vérification du type MIME grâce à fileFilter option de Multer
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format de vidéo non supporté"));
  }
};

// Création du middleware Multer encapsulé dans le service
const upload = multer({
  storage, // fonction storage qui donne le dossier d'enregistrement
  limits: { fileSize: MAX_SIZE },
  fileFilter,
}).single("video"); // la requete n'accepte qu'un seul fichier donc une video à la fois

const uploadVideoService = {

  upload(req, res) {
    return new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return reject({
              status: 400,
              message: "Vidéo trop volumineuse (max 500 Mo).",
            });
          }
          return reject({ status: 400, message: err.message });
        }
        if (!req.file) {
          return reject({
            status: 400,
            message: "Aucun fichier vidéo fourni.",
          });
        }

        // Chemin relatif pour DB
        const videoPath = path.join(__dirname, "../assets/uploads/videos", req.file.filename);
        resolve(videoPath); // renvoie le chemin absolu réel pour ffmpeg
      });
    });
  },
};

module.exports = uploadVideoService;
