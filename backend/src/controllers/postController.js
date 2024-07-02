const Post = require("../services/postService");
const { errorResponse, successResponse } = require("../utils/response");
const minio = require("../databases/minio.js");
const fs = require("fs");

const create = async (req, res) => {
    const user_id = req.user.id;
    const title = req.body.title;
    const filePath = req.file.path;
    const objectName = req.file.originalname;

    try {
        const post = await Post.create({
            likes: 0,
            user_id,
            title
        });

        console.log(post);
        
        try {
            await minio.upload("post" + post.id, objectName, filePath);
        } catch (error) {
            return errorResponse(res, 500, "Can't upload image.");
        }

        await Post.update(post.id, {
            path: "http://localhost:57689/browser/post" + post.id
        })

        fs.unlinkSync(filePath);

        return successResponse(res, 201, "Create post successfully!");
    } catch (error) {
        return errorResponse(res, 500, "Can't create post!");
    }
}

module.exports = {
    create
}