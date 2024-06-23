const express = require("express");

const router = express.Router();

const userApi = require("./userApi");
const postApi = require("./postApi");
const commentApi = require("./commentApi");
const authApi = require("./authApi");

router.use("/user", userApi);
router.use("/post", postApi);
router.use("/comment", commentApi);
router.use("/auth", authApi);

module.exports = router;