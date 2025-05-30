const express = require("express");
const router = express.Router();
const MapController = require("../controllers/MapController");
const checkRole = require("../middlewares/CheckRole");


router.get("/:roundAcronym", MapController.getMapsByRound);
router.post("/add", checkRole, MapController.addMap);
router.post("/edit", checkRole, MapController.editMap);

module.exports = router;
