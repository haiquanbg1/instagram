const express = require("express");

const Comment = require("../controllers/commentController");
const { isAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:post_id", Comment.findAllByPost);
router.post("/:post_id", isAuth, Comment.createByPost);
router.delete("/:comment_id", isAuth, Comment.drop);
router.patch("/:comment_id", isAuth, Comment.update);

module.exports = router;