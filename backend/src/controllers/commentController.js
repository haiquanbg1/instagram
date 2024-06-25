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

const createByPost = async (req, res) => {
    const { post_id } = req.params;
    const user_id = req.user.id;
    const { title } = req.body;

    try {
        await Comment.createByPost({
            post_id,
            user_id,
            title
        });

        return successResponse(res, 201, "Create new comment successfully!", {
            title
        });
    } catch (error) {
        return errorResponse(res, 500, "Can't create new comment!");
    }
}

const update = async (req, res) => {
    const { title } = req.body;
    const { comment_id } = req.params;

    try {
        const comment = await Comment.update(
            comment_id,
            {
                title: title
            }
        );

        if (comment[0]) {
            return successResponse(res, 204);
        } else {
            return errorResponse(res, 404, "Comment not found!");
        }
    } catch (error) {
        return errorResponse(res, 500, "Can't update comment!");
    }
}

const drop = async (req, res) => {
    const { comment_id } = req.params;

    try {
        const comment = await Comment.drop(comment_id);

        if (comment) {
            return successResponse(res, 204);
        } else {
            return errorResponse(res, 404, "Comment not found!");
        }
    } catch (error) {
        return errorResponse(res, 500, "Can't delete comment!");
    }
}

module.exports = {
    findAllByPost,
    createByPost,
    drop,
    update
}