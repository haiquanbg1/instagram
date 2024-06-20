const express = require("express");

const router = express.Router();

const userApi = require("./userApi");
const postApi = require("./postApi");
const commentApi = require("./commentApi");

router.use("/user", userApi);
router.use("/post", postApi);
router.use("/comment", commentApi);

module.exports = router;