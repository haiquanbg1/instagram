const express = require("express");

const Auth = require("../../controllers/authController");

const router = express.Router();

router.post("/register", Auth.register);
router.post("/login", Auth.login);
router.post("/refreshToken", Auth.refreshToken);
router.post("/verifyEmail", Auth.sendVerifyEmail);

module.exports = router;