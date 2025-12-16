// src/utils/generateThumbnail.js
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Import des chemins des exécutables depuis npm
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

// Indiquer à fluent-ffmpeg où se trouvent ffmpeg et ffprobe
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

async function generateThumbnail(videoAbsolutePath) {
  return new Promise((resolve, reject) => {
    const filename =
      path.basename(videoAbsolutePath, path.extname(videoAbsolutePath)) + ".png";

    const thumbnailDir = path.join(
      __dirname,
      "../assets/uploads/img"
    );

    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    ffmpeg(videoAbsolutePath)
      .on("end", () =>
        resolve(`/assets/uploads/img/${filename}`)
      )
      .on("error", reject)
      .screenshots({
        count: 1,
        folder: thumbnailDir,
        filename,
        size: "320x240",
      });
  });
}

module.exports = generateThumbnail;
