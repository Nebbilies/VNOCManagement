const express = require("express");
const router = express.Router();
const OAuthController = require("../controllers/OAuthController");

router.get("/login", OAuthController.login);
router.get("/callback", OAuthController.callback);
router.get("/me", OAuthController.getUser);
router.post("/verify", OAuthController.verifyUser);
router.get("/logout", OAuthController.logout);

module.exports = router;
