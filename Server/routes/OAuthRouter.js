// routes/OAuthRouter.js
const express = require("express");
const router = express.Router();
const OAuthController = require("../controllers/OAuthController");

router.get("/login", OAuthController.login);
router.get("/callback", OAuthController.callback);
router.get("/me", OAuthController.getUser);
router.post("/verify", OAuthController.verifyUser);

module.exports = router;
