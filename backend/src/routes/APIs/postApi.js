const express = require("express");

const { isAuth } = require("../../middleware/authMiddleware");
const Post = require("../../controllers/postController");

const router = express.Router();

router.get("/", (req, res) => {
    return "Quandz";
});
router.post("/", isAuth, Post.create);

module.exports = router;