const express = require("express");
const router = express.Router();
const MapController = require("../controllers/MapController");
const checkRole = require("../middlewares/checkRole");

router.post("/add", checkRole, MapController.addMap);
router.post("/edit", checkRole, MapController.editMap);
router.post("/delete", checkRole, MapController.deleteMap);
router.get("/all", MapController.getAllMaps);
router.get("/:roundAcronym", MapController.getMapsByRound);

module.exports = router;
