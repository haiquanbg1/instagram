const Post = require("../services/postService");
const { errorResponse, successResponse } = require("../utils/response");
const minio = require("../databases/minio.js");
const fs = require("fs");

const create = async (req, res) => {
    const user_id = req.user.id;
    const title = req.body.title;
    const uploadedFiles = req.files;

    try {
        const post = await Post.create({
            likes: 0,
            user_id,
            title
        });

        // create bucket
        const bucketName = "post" + post.id;
        
        for (const file of uploadedFiles) {
            const filePath = file.path;
            const fileName = file.filename;
            console.log(filePath);

            try {
                await minio.upload(bucketName, fileName, filePath);
            } catch (error) {
                return errorResponse(res, 500, "Can't upload image.");
            }
        }

        // delete file in backend
        for (const file of uploadedFiles) {
            const filePath = file.path;

            fs.unlinkSync(filePath);
        }

        // update link image
        await Post.update(post.id, {
            path: "http://localhost:57689/browser/" + bucketName
        });

        return successResponse(res, 201, "Create post successfully!");
    } catch (error) {
        return errorResponse(res, 500, "Can't create post!");
    }
}

const findAll = async (req, res) => {
    try {
        const posts = await Post.findAll();

        return successResponse(res, 200, "Posts are found!", posts);
    } catch (error) {
        return errorResponse(res, 500, "Can't find post!");
    }
}

module.exports = {
    create,
    findAll
}