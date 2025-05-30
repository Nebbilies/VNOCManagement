const express = require("express");
const router = express.Router();
const MapController = require("../controllers/MapController");

router.get("/:roundAcronym", MapController.getMapsByRound);

module.exports = router;
