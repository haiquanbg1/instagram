const Comment = require("../services/commentService");
const { errorResponse, successResponse } = require("../utils/response");

const findAllByPost = async (req, res) => {
    const { post_id } = req.params;

    try {
        const comment = await Comment.findAllByPost(post_id);

        return successResponse(res, 200, "Find comment succesfully!", comment);
    } catch (error) {
        return errorResponse(res, 500, "Can't find comment");
    }
}

module.exports = {
    findAllByPost
}