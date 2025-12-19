const {Router} = require("express");
const ratingController = require("../controllers/rating.controller");
const router = Router();


router.post("/:video_id", ratingController.createRat);
router.get("/:video_id/average", ratingController.getAverage);


module.exports = router;