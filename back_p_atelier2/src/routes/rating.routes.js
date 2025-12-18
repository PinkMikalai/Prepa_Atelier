const {Router} = require("express");
const ratingController = require("../controllers/rating.controller");
const router = Router();

router.get("/", ratingController.getRatings);
router.post("/:video_id", ratingController.createRat);
router.put("/:id", ratingController.updateRating);
router.delete("/:id", ratingController.deleteRating);



module.exports = router;