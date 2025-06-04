const express = require("express");
const router = express.Router();
const MatchController = require("../controllers/MatchController");
const checkRole = require("../middlewares/checkRole");

// Public route
router.get("/", MatchController.getAllMatches);

// Protected routes (admin or referee)
router.post("/add", checkRole, MatchController.addMatch);
router.put("/edit/:id", checkRole, MatchController.editMatch);
router.delete("/:id", checkRole, MatchController.deleteMatch);
router.post("/claim", checkRole, MatchController.claimMatch);

module.exports = router;
