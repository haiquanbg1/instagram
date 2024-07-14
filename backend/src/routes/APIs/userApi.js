const express = require("express");
const User = require("../../controllers/userController");
const { isAuth } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", User.findAll);
router.get("/:id", User.findOne);
router.post("/follow", isAuth, User.followUser);

module.exports = router;