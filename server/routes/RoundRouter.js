const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const RoundController = require("../controllers/RoundController");
const checkRole = require("../middlewares/checkRole");

router.get("/", RoundController.getRound);
router.post("/add", checkRole, RoundController.addRound);
router.post("/edit", checkRole, RoundController.editRound);
router.delete("/delete", checkRole, RoundController.deleteRound);

module.exports = router;
