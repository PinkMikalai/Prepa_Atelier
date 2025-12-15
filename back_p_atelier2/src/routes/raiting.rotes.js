const {Router} = require("express");
const raitingController = require("../controllers/raiting.controller");
const router = Router();

router.get("/", raitingController.getRaitings);
router.post("/", raitingController.createRaiting);
router.put("/:id", raitingController.updateRaiting);
router.delete("/:id", raitingController.deleteRaiting);



module.exports = router;