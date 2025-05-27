const express = require("express");
const router = express.Router();
const PlayerController = require("../controllers/PlayerController");
const checkRole = require("../middlewares/CheckRole");


router.post("/add", PlayerController.addPlayer);
router.delete("/remove/:id", checkRole, PlayerController.removePlayer);
router.get("/all",  PlayerController.getAllPlayers);

module.exports = router;
    