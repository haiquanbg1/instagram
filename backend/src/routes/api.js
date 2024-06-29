const express = require("express");

const router = express.Router();

const userApi = require("./APIs/userApi");
const postApi = require("./APIs/postApi");
const commentApi = require("./APIs/commentApi");
const authApi = require("./APIs/authApi");

router.use("/user", userApi);
router.use("/post", postApi);
router.use("/comment", commentApi);
router.use("/auth", authApi);

module.exports = router;