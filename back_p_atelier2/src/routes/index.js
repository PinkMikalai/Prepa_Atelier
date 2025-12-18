const {Router} = require("express");
const router = Router();

// import des routes
const videoRoutes = require("./videos.routes");
const commentRoutes = require("./comment.routes");
const ratingRoutes = require("./rating.routes");

//ici nos routes
router.use("/videos", videoRoutes);
router.use("/comments", commentRoutes);
router.use("/ratings", ratingRoutes);


module.exports = router;