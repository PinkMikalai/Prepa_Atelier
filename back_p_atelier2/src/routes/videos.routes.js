const {Router} = require("express");
const videoController = require("../controllers/video.controller");

const router = Router();


router.get("/", videoController.getVideos);
router.post("/", videoController.createVideo);
router.put("/:id", videoController.updateVideo);
router.delete("/:id", videoController.deleteVideo);



module.exports = router;