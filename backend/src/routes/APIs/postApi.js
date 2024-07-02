const express = require("express");

const { isAuth } = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/uploadMiddleware");
const Post = require("../../controllers/postController");

const router = express.Router();

router.post("/", isAuth, upload.single('image'), Post.create);

module.exports = router;