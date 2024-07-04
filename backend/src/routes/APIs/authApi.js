const express = require("express");

const Auth = require("../../controllers/authController");

const router = express.Router();

router.post("/register", Auth.register);
router.post("/login", Auth.login);
router.post("/refreshToken", Auth.refreshToken);
router.post("/verifyEmail", Auth.verifyEmail);
router.get("/verifyKey", Auth.verifyKey);
router.post("/checkExists", Auth.checkExists);

module.exports = router;