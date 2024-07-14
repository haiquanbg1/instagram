const Post = require("../services/postService");
const { errorResponse, successResponse } = require("../utils/response");
const minio = require("../databases/minio.js");
const fs = require("fs");
const neo4jService = require("../services/neo4jService.js");
const neo4jPostService = require("../services/neo4jPostService.js");
const neo4jUserService = require("../services/neo4jUserService");
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
        await neo4jPostService.userCreatePost(req.user.userName, "post" + post.id);

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

    await neo4jPostService.userLikePost(userName,"post" + postId)
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

    await neo4jPostService.userUnlikePost(userName,"post" + postId)
    .catch((err) => {
        console.log(err);
        return errorResponse(res, 500, "Can't unlike post!");
    });

    await redis.decr(likeOfPost);

    return successResponse(res, 200, "Unlike post successfully!");
}

const findUserLikePost = async (req, res) => {
    const { postId, page } = req.body;
    const limit = 20;
    const skip = page * limit;

    const users = await neo4jUserService.getUserLikePost("post" + postId, skip, limit)
    .catch((err) => {
        console.log(err);
        return errorResponse(res, 500, "Can't find user like post!");
    });

    return successResponse(res, 200, "Find user like post successfully!", users);
}

module.exports = {
    create,
    findAll,
    like,
    unlike,
    findUserLikePost
}