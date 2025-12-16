const {Router} = require("express");
const { validate } = require('../middleware/validate.js');
const { createCommentSchema, updateCommentSchema} = require('../shemas/comment.shema.js')
const commentController = require("../controllers/comment.controller");


const router = Router();

router.get("/video/:video_id", commentController.getComments);
router.post("/", validate(createCommentSchema), commentController.createComment);
router.put("/:id", validate(updateCommentSchema), commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
