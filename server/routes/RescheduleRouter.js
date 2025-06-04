const express = require("express");
const router = express.Router();
const RescheduleController = require("../controllers/RescheduleController");
const checkRole = require("../middlewares/checkRole");


router.get("/", RescheduleController.getReschedule);

router.post("/add", checkRole, RescheduleController.initiateReschedule);
router.post("/approve", checkRole, RescheduleController.approveReschedule);
router.post("/reject", checkRole, RescheduleController.rejectReschedule);
router.post("/respond", checkRole, RescheduleController.respondReschedule);

module.exports = router;
