const {Router} = require("express");
const commentController = require("../controllers/comment.controller");

const router = Router();

router.get("/", commentController.getComments);
router.post("/", commentController.createComment);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
