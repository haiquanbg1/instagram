const Post = require("../services/postService");
const { errorResponse, successResponse } = require("../utils/response");
const minio = require("../databases/minio.js");
const fs = require("fs");
const neo4jService = require("../services/neo4jService.js");
const redis = require("../databases/redis");

const create = async (req, res) => {
    const user_id = req.user.id;
    const title = req.body.title;
    const uploadedFiles = req.files;

    try {
        // create to mysql
        const post = await Post.create({
            likes: 0,
            user_id,
            title
        });

        // create to neo4j
        await neo4jService.create("Post", "post" + post.id);

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

        return successResponse(res, 201, "Create post successfully!");
    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Can't create post!");
    }
}

const findAll = async (req, res) => {
    const { page } = req.query;

    const limit = 5;
    const offset = page * limit; 

    const result = [];
    try {
        const posts = await Post.findAll(limit, offset);

        for (let i=0; i<limit; i++) {
            const image = await minio.listObjectsAndUrls("post" + posts[i].id); // image in post
            const likes = await Post.countLike(posts[i].id);

            result.push({
                id: posts[i].id,
                likes: likes,
                title: posts[i].title,
                user_id: posts[i].user_id,
                images: image
            });
        }

        return successResponse(res, 200, "Posts are found!", result);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Can't find post!");
    }
}

const like = async (req, res) => {
    const userName = req.user.userName;
    const { postId } = req.body;
    const likeOfPost = `post:${postId}:likes`;

    await neo4jService.likePost(userName,"post" + postId)
    .catch((err) => {
        console.log(err);
        return errorResponse(res, 500, "Can't like post!");
    });

    await redis.incr(likeOfPost);

    return successResponse(res, 200, "Like post successfully!");
}

const unlike = async (req, res) => {
    const userName = req.user.userName;
    const { postId } = req.body;
    const likeOfPost = `post:${postId}:likes`;

    await neo4jService.unlikePost(userName,"post" + postId)
    .catch((err) => {
        console.log(err);
        return errorResponse(res, 500, "Can't unlike post!");
    });

    await redis.decr(likeOfPost);

    return successResponse(res, 200, "Unlike post successfully!");
}

module.exports = {
    create,
    findAll,
    like,
    unlike
}