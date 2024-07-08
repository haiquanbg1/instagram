const express = require("express");

const { isAuth } = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/uploadMiddleware");
const Post = require("../../controllers/postController");

const router = express.Router();

router.post("/", isAuth, upload.array('image', 10), Post.create);
router.get("/", Post.findAll);

module.exports = router;