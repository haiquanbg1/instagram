const express = require("express");
const User = require("../../controllers/userController");

const router = express.Router();

router.get("/", User.findAll);
router.get("/:id", User.findOne);

module.exports = router;