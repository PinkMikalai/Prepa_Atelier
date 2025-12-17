const commentModel = require('../models/commentModel');
const videoModel = require('../models/videoModel');

const addComment = async (data) => {
console.log('videoId reçu :', data.videoId);
  const video = await videoModel.findById(data.videoId);
  console.log('videoId reçu :', video);
  if (!video) {
    throw new Error('Vidéo inexistante');
  }

  return commentModel.create(data);
};

const getCommentsByVideo = async (videoId) => {
  return commentModel.findByVideo(videoId);
};

const updateComment = async (id, content) => {
  return commentModel.update(id, content);
};

const deleteComment = async (id) => {
  return commentModel.delete(id);
};

const countComments = async (videoId) => {
  return commentModel.countCommentsByVideo(videoId);
}

module.exports = {
  addComment,
  getCommentsByVideo,
  updateComment,
  deleteComment,
  countComments
};
