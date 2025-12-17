const commentService = require('../services/comment.service.js');


  async function getCommentsByVideo(req, res) {
   
  try {
    const commentsByVideo = await commentService.getCommentsByVideo(req.params.video_id);
    const countCommentsByVideo = await commentService.countComments(req.params.video_id)
    res.json({
      comments :commentsByVideo, 
      countComments : countCommentsByVideo});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


 async function addComment(req, res) {

   console.log('req.body reçu:', req.body);

  try {
    const comment = await commentService.addComment(req.body);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


 async function updateComment(req, res) {

  try {
    const comment = await commentService.updateComment(req.params.id, req.body.content);
    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



 async function deleteComment(req, res) {

  try {
    await commentService.deleteComment(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = { 
    getCommentsByVideo, 
    addComment, 
    updateComment, 
    deleteComment
};