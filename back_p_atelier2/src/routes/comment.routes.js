const {Router} = require("express");
const { validate } = require('../middleware/validate.js');
const { createCommentSchema, updateCommentSchema} = require('../schemas/comment.schema.js')
const commentController = require("../controllers/comment.controller");


const router = Router();

router.get("/videos/:video_id", commentController.getCommentsByVideo);
router.post("/videos/:video_id", validate(createCommentSchema), commentController.addComment);
router.put("/:id", validate(updateCommentSchema), commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
