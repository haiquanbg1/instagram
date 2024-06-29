const Post = require("../services/postService");
const { errorResponse, successResponse } = require("../utils/response");

const create = async (req, res) => {
    const user_id = req.user.id;
    const title = req.body.title;

    try {
        await Post.create({
            likes: 0,
            user_id,
            title
        });

        return successResponse(res, 201, "Create post successfully!");
    } catch (error) {
        return errorResponse(res, 500, "Can't create post!");
    }
}

module.exports = {
    create
}