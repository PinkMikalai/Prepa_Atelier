const { Router } = require("express");
const { validate } = require('../middleware/validate.js');
const { createVideoSchema, updateVideoSchema } = require('../schemas/comment.schema.js')
const videoController = require("../controllers/video.controller");

const router = Router();


router.get("/", videoController.getVideos);
router.get("/:id/file", videoController.getVideoFile);
router.get("/:id", videoController.getVideoById);
router.post("/", videoController.createVideo);
router.post("/:video_id/view", videoController.addView);
router.put("/:id", videoController.updateVideo);
router.delete("/:id", videoController.deleteVideo);


module.exports = router;