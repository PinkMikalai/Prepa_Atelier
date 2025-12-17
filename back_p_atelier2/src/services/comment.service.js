const commentModel = require('../models/commentModel');
const videoModel = require('../models/videoModel');

const addComment = async (data) => {
  const { video_id, pseudo, content } = data;
  const video = await videoModel.getVideoById(video_id);
  if (!video) {
    throw new Error('Vidéo inexistante');
  }
  console.log('Insertion commentaire:', { video_id, pseudo, content });
  return commentModel.addComment(video_id, pseudo, content);
};

const getCommentsByVideo = async (video_id) => {
  return commentModel.getCommentsByVideo(video_id);
};

const updateComment = async (comment_id, content) => {
  return commentModel.updateComment(comment_id, content);
};

const deleteComment = async (id) => {
  return commentModel.deleteComment(id);
};

const countComments = async (video_id) => {
  return commentModel.countCommentsByVideo(video_id);
}

module.exports = {
  addComment,
  getCommentsByVideo,
  updateComment,
  deleteComment,
  countComments
};
