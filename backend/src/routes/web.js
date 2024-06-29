const express = require("express");

const Auth = require("../controllers/authController");

const router = express.Router();

router.get("/verifyEmail", Auth.verifyEmail);

module.exports = router;