const {Router} = require("express");
const router = Router();

// import des routes
const videoRoutes = require("./videos.routes");
const commentRoutes = require("./comment.routes");
const raitingRoutes = require("./raiting.rotes");

//ici nos routes
router.use("/videos", videoRoutes);
router.use("/comments", commentRoutes);
router.use("/raiting", raitingRoutes);


module.exports = router;