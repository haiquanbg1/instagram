const express = require("express");

const Comment = require("../controllers/commentController");

const router = express.Router();

router.get("/:post_id", Comment.findAllByPost);

module.exports = router;