// const express = require("express");
// const router = express.Router();
// const PlayerController = require("../controllers/PlayerController");
// const checkRole = require("../middlewares/CheckRole");

// router.use(checkRole);

// router.post("/add", PlayerController.addPlayer);         // player tự đăng ký
// router.delete("/remove/:id", PlayerController.removePlayer); // admin
// router.get("/", PlayerController.getAllPlayers);             // admin

// module.exports = router;
const express = require("express");
const router = express.Router();
const PlayerController = require("../controllers/PlayerController");
const checkRole = require("../middlewares/CheckRole");

// Không dùng checkRole cho route add (đăng ký player)
router.post("/add", PlayerController.addPlayer);

// Các route khác cần admin (checkRole bắt buộc)
router.delete("/remove/:id", checkRole, PlayerController.removePlayer);
router.get("/", checkRole, PlayerController.getAllPlayers);

module.exports = router;
